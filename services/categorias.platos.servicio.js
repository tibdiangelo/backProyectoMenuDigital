const supabase = require("./supabaseClient");

const obtenerCategoriasServicio = async (paginacion) => {
    let consulta = supabase
        .from("categoria")
        .select("*", { count: "exact" })
        .order("orden", { ascending: true });

    if (paginacion) {
        consulta = consulta.range(paginacion.from, paginacion.to);
    }

    const { data, error, count } = await consulta;

    if (error) {
        throw new Error(error.message);
    }

    return paginacion ? { data, count } : data;
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