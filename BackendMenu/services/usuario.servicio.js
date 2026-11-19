const supabase = require('./supabaseClient');

const COLUMNAS_USUARIO = 'id, nombre, email, rol_id';

// 1. Obtener todos los usuarios desde Supabase
const obtenerUsuariosDB = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(COLUMNAS_USUARIO);

  if (error) throw error;
  return data;
};

// 2. Obtener un usuario por ID
const obtenerUsuarioPorIdDB = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(COLUMNAS_USUARIO)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// 3. Crear un usuario nuevo
const crearUsuarioDB = async ({ nombre, email, password, rol_id, rol }) => {
  const rolIdFinal = rol_id ?? rol;

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, email, password, rol_id: rolIdFinal }])
    .select(COLUMNAS_USUARIO);

  if (error) throw error;
  return data;
};

// 4. Actualizar usuario
const actualizarUsuarioDB = async (id, camposActualizados) => {
  const { id: _ignorado, ...datosLimpios } = camposActualizados || {};

  const { data, error } = await supabase
    .from('usuarios')
    .update(datosLimpios)
    .eq('id', id)
    .select(COLUMNAS_USUARIO);

  if (error) throw error;
  return data;
};

// 5. Eliminar usuario
const eliminarUsuarioDB = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id)
    .select(COLUMNAS_USUARIO);

  if (error) throw error;
  return data;
};

module.exports = {
  obtenerUsuariosDB,
  obtenerUsuarioPorIdDB,
  crearUsuarioDB,
  actualizarUsuarioDB,
  eliminarUsuarioDB,
};