const  supabase  = require('./supabaseClient');

// 1. Obtener todos los platos de la base de datos
const obtenerPlatosDB = async () => {
    const { data, error } = await supabase.from('platos').select('*');
    if (error) throw error;
    return data;
};

// 2. Obtener un plato por su ID
const obtenerPlatoPorIdDB = async (id) => {
    const { data, error } = await supabase.from('platos').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

// 3. Crear un plato nuevo
const crearPlatoDB = async (nombre, descripcion, precio, categoria) => {
    const { data, error } = await supabase
        .from('platos')
        .insert([{ nombre, descripcion, precio, categoria }]);
    if (error) throw error;
    return data;
};

// 4. Actualizar un plato existente
const actualizarPlatoDB = async (id, camposActualizados) => {
    const { data, error } = await supabase
        .from('platos')
        .update(camposActualizados)
        .eq('id', id);
    if (error) throw error;
    return data;
};

// 5. Eliminar un plato
const eliminarPlatoDB = async (id) => {
    const { data, error } = await supabase
        .from('platos')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return data;
};

module.exports = {
    obtenerPlatosDB,
    obtenerPlatoPorIdDB,
    crearPlatoDB,
    actualizarPlatoDB,
    eliminarPlatoDB
};