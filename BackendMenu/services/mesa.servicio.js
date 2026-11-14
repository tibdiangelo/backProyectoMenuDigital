const supabase  = require('./supabaseClient');

// 1. Obtener todas las mesas
const obtenerMesasDB = async () => {
    const { data, error } = await supabase.from('mesa').select('*');
    if (error) throw error;
    return data;
};

// 2. Obtener una sola mesa por su ID
const obtenerMesaPorIdDB = async (id) => {
    const { data, error } = await supabase.from('mesa').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

// 3. Crear una nueva mesa
const crearMesaDB = async (numero_mesa, capacidad, estado) => {
    const { data, error } = await supabase
        .from('mesa')
        .insert([{ numero_mesa, capacidad, estado }]);
    if (error) throw error;
    return data;
};

// 4. Actualizar el estado o los datos de la mesa
const actualizarMesaDB = async (id, camposActualizados) => {
    const { data, error } = await supabase
        .from('mesa')
        .update(camposActualizados)
        .eq('id', id);
    if (error) throw error;
    return data;
};

// 5. Eliminar una mesa
const eliminarMesaDB = async (id) => {
    const { data, error } = await supabase
        .from('mesa')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return data;
};

module.exports = {
    obtenerMesasDB,
    obtenerMesaPorIdDB,
    crearMesaDB,
    actualizarMesaDB,
    eliminarMesaDB
};