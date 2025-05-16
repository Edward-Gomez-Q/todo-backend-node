const { Tarea } = require('../models');
const { Usuario } = require('../models');

const { Op, Sequelize } = require('sequelize');
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
exports.obtenerTareas = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            estado, 
            fecha, 
            fechaInicioReq, 
            fechaFinReq, 
            masRecientes, 
            searchTituloAndDescription 
        } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const options = {
            where: { usuarios_id: req.userId },
            limit: limitNum,
            offset: (pageNum - 1) * limitNum,
            order: []
        };
        if (estado !== undefined) {
            options.where.estado_id = estado;
        }
        if (fecha !== undefined) {
            const campoFecha = fecha === 'fechaLimite' ? 'fechaLimite' : 'createdAt';
            if (masRecientes !== undefined) {
                options.order.push([campoFecha, masRecientes === 'true' ? 'DESC' : 'ASC']);
            } else if (fechaInicioReq && fechaFinReq) {
                const fechaInicio = new Date(fechaInicioReq);
                fechaInicio.setHours(0, 0, 0, 0);
                
                const fechaFin = new Date(fechaFinReq);
                fechaFin.setHours(23, 59, 59, 999);
                
                options.where[campoFecha] = {
                    [Op.between]: [fechaInicio, fechaFin]
                };
            } else {
                const fechaActual = new Date();
                fechaActual.setHours(0, 0, 0, 0);
                const finDia = new Date(fechaActual);
                finDia.setHours(23, 59, 59, 999);
                options.where[campoFecha] = {
                    [Op.between]: [fechaActual, finDia]
                };
            }
        }
        if (searchTituloAndDescription) {
            options.order.unshift([
                Sequelize.literal(`CASE 
                    WHEN LOWER(titulo) LIKE LOWER('%${searchTituloAndDescription}%') THEN 0 
                    WHEN LOWER(descripcion) LIKE LOWER('%${searchTituloAndDescription}%') THEN 1 
                    ELSE 2 
                END`), 
                'ASC'
            ]);
            options.where[Op.or] = [
                { titulo: { [Op.iLike]: `%${searchTituloAndDescription}%` } },
                { descripcion: { [Op.iLike]: `%${searchTituloAndDescription}%` } }
            ];
        }
        if (options.order.length === 0) {
            options.order.push(['createdAt', 'DESC']);
        }
        const total = await Tarea.count({ where: options.where });
        const tareas = await Tarea.findAll(options);
        return res.status(200).json({ 
            tareas,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return res.status(500).json({ mensaje: 'Error al obtener las tareas' });
    }
}