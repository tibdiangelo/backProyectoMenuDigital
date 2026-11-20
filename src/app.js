try {
    process.loadEnvFile();
} catch {
    // Si no existe .env, se usan las variables ya definidas en el entorno.
}

const express =require ("express");
const cors =require("cors");
const app = express ();
const PORT = process.env.PORT || 3000;
const { origenesPermitidos } = require('./middlewares/rateLimit.middleware');
const trustProxy = process.env.TRUST_PROXY;

if (trustProxy !== undefined && trustProxy !== '') {
    const valorTrustProxy = trustProxy === 'true'
        ? true
        : /^\d+$/.test(trustProxy)
            ? Number(trustProxy)
            : trustProxy;

    app.set('trust proxy', valorTrustProxy);
}

const mesaRutas =require( "../routers/mesa.rutas");
const pedidoRutas =require("../routers/pedido.ruta");
const usuarioRutas =require("../routers/usuario.ruta");
const platoRutas =require("../routers/platos.ruta");
const categoriaRutas =require("../routers/categoria.platos.ruta");
const detalleRutas =require("../routers/detalle.pedido.ruta");
const estadoRutas =require ("../routers/estado.pedido.ruta");
const rolRutas =require("../routers/rol.ruta");



app.use(express.json({ limit: '100kb' }));
app.use(cors({
  origin: (origin, callback) => {
    callback(null, Boolean(origin) && origenesPermitidos.includes(origin));
  },
  credentials: true,
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
}));

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
