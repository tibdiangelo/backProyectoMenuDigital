const platoServicio = require('../services/platos.servicio');

// Listar todos los platos (ruta pública)
const obtenerPlatos = async (req, res) => {
  try {
    const platos = await platoServicio.obtenerPlatosDB();
    return res.status(200).json(platos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener un plato por ID (ruta pública)
const obtenerPlatoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const plato = await platoServicio.obtenerPlatoPorIdDB(id);
    return res.status(200).json(plato);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Crear plato
const crearPlato = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria_id, categoria } = req.body;
    const categoriaValor = categoria_id ?? categoria;

    if (!nombre || precio === undefined || precio === null) {
      return res
        .status(400)
        .json({ error: 'Los campos nombre y precio son obligatorios' });
    }

    const nuevoPlato = await platoServicio.crearPlatoDB({
      nombre,
      descripcion,
      precio,
      categoria_id: categoriaValor,
    });

    return res
      .status(201)
      .json({ mensaje: 'Plato creado con éxito', data: nuevoPlato });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar plato
const actualizarPlato = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;

    if (!datosActualizar || Object.keys(datosActualizar).length === 0) {
      return res
        .status(400)
        .json({ error: 'Debes enviar al menos un campo para actualizar' });
    }

    const platoActualizado = await platoServicio.actualizarPlatoDB(
      id,
      datosActualizar
    );

    return res.status(200).json({
      mensaje: 'Plato actualizado con éxito',
      data: platoActualizado,
    });
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar plato
const eliminarPlato = async (req, res) => {
  try {
    const { id } = req.params;
    await platoServicio.eliminarPlatoDB(id);
    return res.status(200).json({ mensaje: 'Plato eliminado correctamente' });
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerPlatos,
  obtenerPlatoPorId,
  crearPlato,
  actualizarPlato,
  eliminarPlato,
};