const { Tarea } = require('../models');
const { Usuario } = require('../models');

//Crear una nueva tarea
exports.crearTarea = async (req, res) => {
    const { title, description, dueDate } = req.body;
    try {
        const usuario = await Usuario.findByPk(req.userId);
        const nuevaTarea = await Tarea.create({
            titulo: title,
            descripcion: description,
            fechaLimite: dueDate,
            usuarios_id: usuario.id,
        });
        return res.status(201).json({ mensaje: 'Tarea creada exitosamente', tarea: nuevaTarea });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear la tarea' });
    }
}