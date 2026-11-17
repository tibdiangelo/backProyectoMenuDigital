const bcrypt = require('bcryptjs');
const supabase = require('../services/supabaseClient');

const ADMIN_POR_DEFECTO = {
    nombre: 'Administrador',
    email: 'admin@pizzeria.com',
    password: 'Admin1234*'
};

const ROL_ADMIN_POR_DEFECTO = 2;

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
            String(usuario.email ?? '').toLowerCase() ===
            ADMIN_POR_DEFECTO.email
    );

    const hashAdmin = await bcrypt.hash(ADMIN_POR_DEFECTO.password, 10);

    if (adminExistente) {
        const { error } = await supabase
            .from('usuarios')
            .update({
                password: hashAdmin,
                rol_id: rolAdmin ?? ROL_ADMIN_POR_DEFECTO
            })
            .eq('id', adminExistente.id);

        if (error) throw error;

        console.log(`   Admin actualizado (id ${adminExistente.id}).`);
    } else {
        const { error } = await supabase.from('usuarios').insert([
            {
                nombre: ADMIN_POR_DEFECTO.nombre,
                email: ADMIN_POR_DEFECTO.email,
                password: hashAdmin,
                rol_id: rolAdmin ?? ROL_ADMIN_POR_DEFECTO
            }
        ]);

        if (error) throw error;

        console.log('   Admin creado.');
    }

    console.log('');
    console.log('Migración terminada.');
    console.log(`Admin: ${ADMIN_POR_DEFECTO.email}`);
    console.log(`Contraseña: ${ADMIN_POR_DEFECTO.password}`);
}

main().catch((error) => {
    console.error('Error en la migración:', error.message);
    process.exit(1);
});