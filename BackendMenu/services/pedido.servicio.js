const supabase =require ('./supabaseClient');

// 1. Obtener todos los pedidos
const obtenerPedidosDB = async () => {
    const { data, error } = await supabase.from('pedidos').select('*');
    if (error) throw error;
    return data;
};

// 2. Obtener un pedido por su ID
const obtenerPedidoPorIdDB = async (id) => {
    const { data, error } = await supabase.from('pedidos').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

// 3. Crear un nuevo pedido
const crearPedidoDB = async (mesa_id, usuario_id, total, estado) => {
    const { data, error } = await supabase
        .from('pedidos')
        .insert([{ mesa_id, usuario_id, total, estado }]);
    if (error) throw error;
    return data;
};

// 4. Actualizar un pedido (ej: cambiar el estado de pendiente a listo)
const actualizarPedidoDB = async (id, camposActualizados) => {
    const { data, error } = await supabase
        .from('pedidos')
        .update(camposActualizados)
        .eq('id', id);
    if (error) throw error;
    return data;
};

// 5. Eliminar un pedido
const eliminarPedidoDB = async (id) => {
    const { data, error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return data;
};

module.exports = {
    obtenerPedidosDB,
    obtenerPedidoPorIdDB,
    crearPedidoDB,
    actualizarPedidoDB,
    eliminarPedidoDB
};