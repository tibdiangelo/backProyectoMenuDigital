const supabase = require("../../config/supabaseClient");

const getAllMenu = async () => {
    const { data, error } = await supabase
        .from("plato")
        .select(`
            id,
            nombre,
            descripción,
            precio,
            imagen,
            disponible,
            categoria_id,
            categoria (
                id,
                nombre,
                orden
            )
        `)
        .order("id", { ascending: true });

    if (error) {
        throw new Error(`Error consultando los platos: ${error.message}`);
    }

    return data;
};

module.exports = {
    getAllMenu
};