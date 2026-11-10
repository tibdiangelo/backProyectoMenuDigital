const menuService = require("../services/menu.service");

const getAllMenu = async (req, res) => {
    try {
        const platos = await menuService.getAllMenu();

        return res.status(200).json({
            success: true,
            total: platos.length,
            data: platos
        });
    } catch (error) {
        console.error("Error al obtener el menú:", error.message);

        return res.status(500).json({
            success: false,
            message: "No se pudieron obtener los platos del menú"
        });
    }
};

module.exports = {
    getAllMenu
};
