const supabase = require('./supabaseClient');

const COLUMNAS_PLATO = 'id, nombre, descripcion, precio, categoria_id';

// 1. Obtener todos los platos ordenados desde BD (solo columnas necesarias)
const obtenerPlatosDB = async () => {
  const { data, error } = await supabase
    .from('platos')
    .select(COLUMNAS_PLATO)
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
};

// 2. Obtener un plato por su ID
const obtenerPlatoPorIdDB = async (id) => {
  const { data, error } = await supabase
    .from('platos')
    .select(COLUMNAS_PLATO)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// 3. Crear un plato nuevo
const crearPlatoDB = async ({ nombre, descripcion, precio, categoria_id, categoria }) => {
  const categoriaValor = categoria_id ?? categoria;

  const { data, error } = await supabase
    .from('platos')
    .insert([{ nombre, descripcion, precio, categoria_id: categoriaValor }])
    .select(COLUMNAS_PLATO);

  if (error) throw error;
  return data;
};

// 4. Actualizar un plato existente
const actualizarPlatoDB = async (id, camposActualizados) => {
  const { id: _ignorado, ...datosLimpios } = camposActualizados || {};

  const { data, error } = await supabase
    .from('platos')
    .update(datosLimpios)
    .eq('id', id)
    .select(COLUMNAS_PLATO);

  if (error) throw error;
  return data;
};

// 5. Eliminar un plato
const eliminarPlatoDB = async (id) => {
  const { data, error } = await supabase
    .from('platos')
    .delete()
    .eq('id', id)
    .select(COLUMNAS_PLATO);

  if (error) throw error;
  return data;
};

module.exports = {
  obtenerPlatosDB,
  obtenerPlatoPorIdDB,
  crearPlatoDB,
  actualizarPlatoDB,
  eliminarPlatoDB,
};