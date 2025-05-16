

exports.verificarPermisosPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        console.log(userId + ' ' + id);
        if (userId !== parseInt(id)) {
            return res.status(403).json({ mensaje: 'No tienes permisos para acceder a este recurso' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al verificar permisos' });
    }
}