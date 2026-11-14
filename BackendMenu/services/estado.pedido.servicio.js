const supabase = require("./supabaseClient");

const obtenerEstadosServicio = async () => {
    const { data, error } = await supabase
        .from("estado_pedido")
        .select("*");

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

const crearEstadoServicio = async (estado) => {
    const { data, error } = await supabase
        .from("estado_pedido")
        .insert([estado])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const actualizarEstadoServicio = async (id, datosActualizados) => {
    const { data, error } = await supabase
        .from("estado_pedido")
        .update(datosActualizados)
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const eliminarEstadoServicio = async (id) => {
    const { data, error } = await supabase
        .from("estado_pedido")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

module.exports = {
    obtenerEstadosServicio,
    crearEstadoServicio,
    actualizarEstadoServicio,
    eliminarEstadoServicio
};