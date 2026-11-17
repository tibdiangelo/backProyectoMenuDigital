const supabase = require ('./supabaseClient');

// 1. Obtener todos los usuarios desde Supabase
const obtenerUsuariosDB = async () => {
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) throw error;
    return data;
};

// 2. Obtener un usuario por ID
const obtenerUsuarioPorIdDB = async (id) => {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

// 3. Crear un usuario nuevo
const crearUsuarioDB = async (nombre, email, password, rol_id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nombre, email, password, rol_id }])
        .select()
        .single();
    if (error) throw error;
    return data;
};

// 4. Actualizar usuario
const actualizarUsuarioDB = async (id, camposActualizados) => {
    const { data, error } = await supabase
        .from('usuarios')
        .update(camposActualizados)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

// 5. Eliminar usuario
const eliminarUsuarioDB = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return data;
};

module.exports = {
    obtenerUsuariosDB,
    obtenerUsuarioPorIdDB,
    crearUsuarioDB,
    actualizarUsuarioDB,
    eliminarUsuarioDB
};