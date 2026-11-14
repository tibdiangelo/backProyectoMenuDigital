const express =require ("express");
const cors =require("cors");
const app = express ();
const PORT = 3000;
const mesaRutas =require( "../routers/mesa.rutas");
const pedidoRutas =require("../routers/pedido.ruta");
const usuarioRutas =require("../routers/usuario.ruta");
const platoRutas =require("../routers/platos.ruta");
const categoriaRutas =require("../routers/categoria.platos.ruta");
const detalleRutas =require("../routers/detalle.pedido.ruta");
const estadoRutas =require ("../routers/estado.pedido.ruta");
const rolRutas =require("../routers/rol.ruta");



app.use (express.json());
app.use(cors());
app.use("/api/mesas",  mesaRutas);
app.use("/api/pedidos", pedidoRutas);
app.use("/api/usuarios", usuarioRutas);
app.use("/api/platos", platoRutas);
app.use("/api/categorias", categoriaRutas);
app.use("/api/detalles",detalleRutas);
app.use("/api/estados", estadoRutas);
app.use("/api/rol", rolRutas);


app.get ("/", (req, res) => {
    res.send ("servidor del menu digital funcionando correctamente");
});



app.listen(PORT, () => {
    console.log (`Servidor corriendo en http://localhost:${PORT}`);
});
