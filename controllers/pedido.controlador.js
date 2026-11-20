const pedidoServicio =require ('../services/pedido.servicio');

// Listar todos los pedidos
const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoServicio.obtenerPedidosDB();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un pedido por ID
const obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidoServicio.obtenerPedidoPorIdDB(id);
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un pedido
const crearPedido = async (req, res) => {
    try {
        const { mesa_id, usuario_id, total, estado, cliente_nombre, notas } = req.body;
        const nuevoPedido = await pedidoServicio.crearPedidoDB(
            mesa_id,
            usuario_id,
            total,
            estado,
            cliente_nombre,
            notas
        );
        res.status(201).json({ mensaje: "Pedido creado con éxito", data: nuevoPedido });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un pedido con todos sus detalles en una sola transacción
const crearPedidoCompleto = async (req, res) => {
    try {
        const {
            mesa_id,
            usuario_id,
            estado,
            cliente_nombre,
            notas,
            detalles
        } = req.body;

        const nuevoPedido = await pedidoServicio.crearPedidoConDetallesDB({
            mesa_id,
            usuario_id,
            estado,
            cliente_nombre,
            notas,
            detalles
        });

        res.status(201).json({
            mensaje: "Pedido creado con éxito",
            data: nuevoPedido
        });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

// Actualizar un pedido
const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        const pedidoActualizado = await pedidoServicio.actualizarPedidoDB(id, datosActualizar);
        res.status(200).json({ mensaje: "Pedido actualizado con éxito", data: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un pedido
const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        await pedidoServicio.eliminarPedidoDB(id);
        res.status(200).json({ mensaje: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    crearPedidoCompleto,
    actualizarPedido,
    eliminarPedido
};