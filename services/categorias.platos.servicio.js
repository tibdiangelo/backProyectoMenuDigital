const supabase = require("./supabaseClient");

const obtenerCategoriasServicio = async () => {
    const { data, error } = await supabase
        .from("categoria")
        .select("*")
        .order("orden", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

const crearCategoriaServicio = async (nombre, orden) => {
    const { data, error } = await supabase
        .from("categoria")
        .insert([{ nombre, orden }])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const actualizarCategoriaServicio = async (id, nombre, orden) => {
    const { data, error } = await supabase
        .from("categoria")
        .update({ nombre, orden })
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

const eliminarCategoriaServicio = async (id) => {
    const { data, error } = await supabase
        .from("categoria")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

module.exports = {
    obtenerCategoriasServicio,
    crearCategoriaServicio,
    actualizarCategoriaServicio,
    eliminarCategoriaServicio
};