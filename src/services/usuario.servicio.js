const supabase = require("../../config/supabaseClient");
// Opcional: si usas bcrypt para las contraseñas
// const bcrypt = require("bcrypt");

// 1. CREATE (Crear / Registrar un usuario)
async function createUser(userInfo) {
    let { nombre, email, password, rol_id } = userInfo;

    // Nota: Si envías el password en texto plano y quieres hashearlo aquí con bcrypt:
    // const salt = await bcrypt.genSalt(10);
    // password = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
        .from("usuarios")
        .insert([
            {
                nombre,
                email,
                password,
                rol_id: rol_id || 2, // Por defecto un rol estándar si no se envía
            },
        ])
        .select()
        .single();

    if (error) {
        const err = new Error("No se pudo registrar el usuario: " + error.message);
        err.status = 400;
        throw err;
    }

    return data;
}

// 2. READ: Obtener todos los usuarios
async function getAllUsers() {
    const { data, error } = await supabase
        .from("usuarios")
        .select("id, nombre, email, rol_id")
        .order("id", { ascending: true });

    if (error) {
        const err = new Error("Usuarios no encontrados");
        err.status = 404;
        throw err;
    }

    return data;
}

// 3. READ: Obtener un único usuario por ID
async function getUser(id) {
    const { data, error } = await supabase
        .from("usuarios")
        .select("id, nombre, email, rol_id")
        .eq("id", id)
        .single();

    if (error) {
        const err = new Error("Usuario no encontrado");
        err.status = 404;
        throw err;
    }
    return data;
}

// 3.1 EXTRA: Buscar usuario por email (Ideal para Login)
async function getUserByEmail(email) {
    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

    if (error) {
        const err = new Error("Credenciales inválidas o usuario no encontrado");
        err.status = 404;
        throw err;
    }
    return data;
}

// 4. UPDATE: Editar usuario
async function updateUser(id, info) {
    // Validamos primero que el usuario exista
    await getUser(id);

    let { nombre, email, password, rol_id } = info;

    const datosActualizados = {};
    if (nombre !== undefined) datosActualizados.nombre = nombre;
    if (email !== undefined) datosActualizados.email = email;
    if (password !== undefined) datosActualizados.password = password;
    if (rol_id !== undefined) datosActualizados.rol_id = rol_id;

    const { data, error } = await supabase
        .from("usuarios")
        .update(datosActualizados)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        const err = new Error("No se pudo actualizar el usuario: " + error.message);
        err.status = 400;
        throw err;
    }

    return data;
}

// 5. DELETE: Eliminar usuario
async function deleteUser(id) {
    // Validamos primero que el usuario exista
    await getUser(id);

    const { error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", id);

    if (error) {
        const err = new Error("No se pudo eliminar el usuario");
        err.status = 400;
        throw err;
    }

    return { message: "Usuario eliminado exitosamente", id };
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUserByEmail,
    updateUser,
    deleteUser,
};