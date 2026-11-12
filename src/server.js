const express = require ("express");
const cors = require ("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send ('Servidor del menú digital funcionando correctamente');
});

const menuRouters = require ("./routers/menu.router")
app.use("/menu/:id", menuRouters)

const usuarioRouters = require ("./routers/usuario.ruta")
app.use("/usuario/:id", usuarioRouters)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 
});