const supabase = require("./supabaseClient");

const obtenerRolesServicio = async () => {
    const { data, error } = await supabase
        .from("rol")
        .select("*");

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

const crearRolServicio = async (rol) => {
    const { data, error } = await supabase
        .from("rol")
        .insert([rol])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const actualizarRolServicio = async (id, datosActualizados) => {
    const { data, error } = await supabase
        .from("rol")
        .update(datosActualizados)
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const eliminarRolServicio = async (id) => {
    const { data, error } = await supabase
        .from("rol")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

module.exports = {
    obtenerRolesServicio,
    crearRolServicio,
    actualizarRolServicio,
    eliminarRolServicio
};