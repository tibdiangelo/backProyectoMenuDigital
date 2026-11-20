const  supabase  = require('./supabaseClient');

// 1. Obtener todos los platos de la base de datos (o una página)
const obtenerPlatosDB = async (paginacion) => {
    let consulta = supabase.from('platos').select('*', { count: 'exact' });

    if (paginacion) {
        consulta = consulta.range(paginacion.from, paginacion.to);
    }

    const { data, error, count } = await consulta;
    if (error) throw error;
    return paginacion ? { data, count } : data;
};

// 2. Obtener un plato por su ID
const obtenerPlatoPorIdDB = async (id) => {
    const { data, error } = await supabase.from('platos').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

// 3. Crear un plato nuevo
const crearPlatoDB = async (plato) => {
    const { data, error } = await supabase
        .from('platos')
        .insert([plato])
        .select()
        .single();
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