require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el archivo .env'
  );
  process.exit(1);
}

// Cliente administrativo solo para scripts en servidor
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function obtenerRolesMap() {
  const { data, error } = await supabaseAdmin
    .from('rol')
    .select('id, nombre');

  if (error) {
    throw new Error(`Error consultando tabla rol: ${error.message}`);
  }

  const mapaRoles = new Map();
  for (const r of data || []) {
    mapaRoles.set(r.id, r.nombre);
  }
  return mapaRoles;
}

async function obtenerUsuarios() {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, nombre, email, rol_id');

  if (error) {
    throw new Error(`Error consultando tabla usuarios: ${error.message}`);
  }

  return data || [];
}

async function buscarUsuarioAuthPorEmail(emailNormalizado) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(`Error consultando usuarios en Auth: ${error.message}`);
  }

  return data.users.find(
    (u) => u.email?.trim().toLowerCase() === emailNormalizado
  );
}

async function migrarAuth() {
  const resumen = {
    total: 0,
    creados: 0,
    actualizados: 0,
    omitidos: 0,
    errores: 0,
  };

  try {
    const mapaRoles = await obtenerRolesMap();
    const usuarios = await obtenerUsuarios();
    resumen.total = usuarios.length;

    for (const usuario of usuarios) {
      try {
        const emailLimpio = usuario.email?.trim().toLowerCase();

        if (!emailLimpio) {
          console.warn(`Usuario ID ${usuario.id} omitido: sin correo válido.`);
          resumen.omitidos++;
          continue;
        }

        const nombreRol = mapaRoles.get(usuario.rol_id) || 'usuario';
        const existente = await buscarUsuarioAuthPorEmail(emailLimpio);

        if (!existente) {
          // Contraseña temporal segura; nunca se imprime en consola
          const passwordTemporal = `Menu#${Math.random().toString(36).slice(2, 10)}!9A`;

          const { error: createError } =
            await supabaseAdmin.auth.admin.createUser({
              email: emailLimpio,
              password: passwordTemporal,
              email_confirm: true,
              user_metadata: {
                nombre: usuario.nombre || '',
                usuario_id: usuario.id,
              },
              app_metadata: {
                role: nombreRol,
              },
            });

          if (createError) {
            throw new Error(createError.message);
          }

          resumen.creados++;
        } else {
          const { error: updateError } =
            await supabaseAdmin.auth.admin.updateUserById(existente.id, {
              user_metadata: {
                ...existente.user_metadata,
                nombre: usuario.nombre || existente.user_metadata?.nombre || '',
                usuario_id: usuario.id,
              },
              app_metadata: {
                ...existente.app_metadata,
                role: nombreRol,
              },
            });

          if (updateError) {
            throw new Error(updateError.message);
          }

          resumen.actualizados++;
        }
      } catch (err) {
        resumen.errores++;
        console.error(
          `Error con usuario ID ${usuario.id} (${usuario.email || 'sin email'}): ${err.message}`
        );
      }
    }

    console.log('Migración finalizada. Resumen:', resumen);
  } catch (err) {
    console.error('Error crítico ejecutando la migración:', err.message);
    process.exit(1);
  }
}

migrarAuth();

