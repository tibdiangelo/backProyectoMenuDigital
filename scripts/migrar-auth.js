try {
    process.loadEnvFile();
} catch {
    // Si no existe .env, las variables pueden venir del entorno del proceso.
}

const bcrypt = require('bcryptjs');
const supabase = require('../services/supabaseClient');

const ROL_ADMIN_POR_DEFECTO = 2;

function obtenerAdminDesdeEntorno() {
    const nombre = 'Administrador';
    const email = String(process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
    const password = String(process.env.ADMIN_PASSWORD ?? '');

    if (!email || !password) {
        throw new Error(
            'Faltan las variables de entorno ADMIN_EMAIL y/o ADMIN_PASSWORD. Defínelas en el archivo .env antes de ejecutar la migración.'
        );
    }

    if (password.length < 8) {
        throw new Error(
            'ADMIN_PASSWORD debe tener al menos 8 caracteres.'
        );
    }

    return { nombre, email, password };
}

async function asegurarRol(nombre) {
    const { data, error } = await supabase
        .from('rol')
        .select('*')
        .eq('nombre', nombre);

    if (error) throw error;

    if (data && data.length > 0) {
        return data[0].id;
    }

    const { data: creado, error: errorCrear } = await supabase
        .from('rol')
        .insert([{ nombre, usuario_id: null }])
        .select()
        .single();

    if (errorCrear) throw errorCrear;

    return creado.id;
}

async function main() {
    const admin = obtenerAdminDesdeEntorno();

    console.log('1. Hasheando contraseñas existentes...');

    const { data: usuarios, error: errorUsuarios } = await supabase
        .from('usuarios')
        .select('*');

    if (errorUsuarios) throw errorUsuarios;

    for (const usuario of usuarios ?? []) {
        const passwordActual = String(usuario.password ?? '');

        if (!passwordActual || passwordActual.startsWith('$2')) {
            continue;
        }

        const hash = await bcrypt.hash(passwordActual, 10);
        const { error } = await supabase
            .from('usuarios')
            .update({ password: hash })
            .eq('id', usuario.id);

        if (error) throw error;

        console.log(`   Usuario ${usuario.id} (${usuario.email}) actualizado.`);
    }

    console.log('2. Creando/actualizando el administrador inicial...');

    const rolAdmin = await asegurarRol('administrador');
    await asegurarRol('chef');

    const adminExistente = (usuarios ?? []).find(
        (usuario) =>
            String(usuario.email ?? '').toLowerCase() === admin.email
    );

    if (adminExistente) {
        const camposActualizados = {
            rol_id: rolAdmin ?? ROL_ADMIN_POR_DEFECTO
        };

        // Solo se fuerza el cambio si el indicador aún no está en false.
        if (adminExistente.debe_cambiar_password !== false) {
            camposActualizados.debe_cambiar_password = true;
        }

        const { error } = await supabase
            .from('usuarios')
            .update(camposActualizados)
            .eq('id', adminExistente.id);

        if (error) throw error;

        console.log(`   Admin asegurado (id ${adminExistente.id}).`);
    } else {
        const hashAdmin = await bcrypt.hash(admin.password, 10);
        const { error } = await supabase.from('usuarios').insert([
            {
                nombre: admin.nombre,
                email: admin.email,
                password: hashAdmin,
                rol_id: rolAdmin ?? ROL_ADMIN_POR_DEFECTO,
                debe_cambiar_password: true
            }
        ]);

        if (error) throw error;

        console.log('   Admin creado.');
    }

    console.log('');
    console.log('Migración terminada.');
    console.log(`Admin asegurado: ${admin.email}`);
}

main().catch((error) => {
    console.error('Error en la migración:', error.message);
    process.exit(1);
});
