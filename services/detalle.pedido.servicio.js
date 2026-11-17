const supabase = require("./supabaseClient");

const obtenerDetallesServicio = async () => {
    const { data, error } = await supabase
        .from("detalle_pedido") // Asegúrate de que tu tabla en Supabase se llame exactamente así
        .select("*");

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

const crearDetalleServicio = async (detalle) => {
    const { data, error } = await supabase
        .from("detalle_pedido")
        .insert([detalle])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const actualizarDetalleServicio = async (id, datosActualizados) => {
    const { data, error } = await supabase
        .from("detalle_pedido")
        .update(datosActualizados)
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const eliminarDetalleServicio = async (id) => {
    const { data, error } = await supabase
        .from("detalle_pedido")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

module.exports = {
    obtenerDetallesServicio,
    crearDetalleServicio,
    actualizarDetalleServicio,
    eliminarDetalleServicio
};