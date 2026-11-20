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

// 3. Crear un pedido con todos sus detalles en una sola transacción
const crearPedidoConDetallesDB = async ({
    mesa_id,
    usuario_id,
    estado,
    cliente_nombre,
    notas,
    detalles
}) => {
    const { data, error } = await supabase.rpc('crear_pedido_con_detalles', {
        p_mesa_id: mesa_id ?? null,
        p_usuario_id: usuario_id ?? null,
        p_estado: estado ?? 'Pendiente',
        p_cliente_nombre: cliente_nombre ?? null,
        p_notas: notas ?? null,
        p_detalles: detalles ?? []
    });

    if (error) {
        if (error.code === 'PGRST202') {
            const errorFuncion = new Error(
                'Falta crear la función crear_pedido_con_detalles en Supabase. ' +
                'Ejecuta scripts/crear-pedido-con-detalles.sql.'
            );
            errorFuncion.status = 500;
            throw errorFuncion;
        }

        const esErrorDeValidacion = ['22023', '23503', '23514'].includes(error.code);
        const errorPedido = new Error(
            error.message || 'No se pudo crear el pedido.'
        );
        errorPedido.status = esErrorDeValidacion ? 400 : 500;
        throw errorPedido;
    }

    return data;
};

// 3.1 Crear un pedido sin detalles (endpoint anterior)
const crearPedidoDB = async (mesa_id, usuario_id, total, estado, cliente_nombre, notas) => {
    const { data, error } = await supabase
        .from('pedidos')
        .insert([{
            mesa_id,
            usuario_id,
            total,
            estado,
            cliente_nombre,
            notas,
            fecha: new Date().toISOString()
        }])
        .select()
        .single();
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
    crearPedidoConDetallesDB,
    crearPedidoDB,
    actualizarPedidoDB,
    eliminarPedidoDB
};