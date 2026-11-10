const express = require("express");
const app = express();
const PORT = 3000;

// Importar las rutas de usuarios
const usuarioRoutes = require("./routes/usuarioRoutes"); // Ajusta la ruta de la carpeta si es necesario (ej: ./routes/usuario.routes)

app.use(express.json());

// Ruta de bienvenida / prueba
app.get("/", (req, res) => {
    res.send("Servidor del menú digital funcionando correctamente");
});

// Ruta de menú existente
app.get("/api/menu", (req, res) => {
    res.json([
        // Las 4 Pizzas
        { id: 1, nombre: 'Pizza Hawaiana (Mediana)', precio: 35000 },
        { id: 2, nombre: 'Pizza pepperoni (Mediana)', precio: 35000 },
        { id: 3, nombre: 'Pizza jamon y queso (Mediana)', precio: 35000 },
        { id: 4, nombre: 'Pizza napolitana (Mediana)', precio: 350000 }, // (Nota: revisa si el precio era 35000 o 350000)
        
        // Las 3 Sodas
        { id: 5, nombre: 'Soda de Maracuyá', precio: 9000 },
        { id: 6, nombre: 'Soda de Frutos Rojos', precio: 9000 },
        { id: 7, nombre: 'Soda de Mango', precio: 9000 }
    ]);
});

// REGISTRAR LAS RUTAS DE USUARIOS
app.use("/api/usuarios", usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});