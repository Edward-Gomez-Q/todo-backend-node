const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea} = require('../controllers/tarea.controller.js');
const middlewareAcceso = require('../middlewares/verificarTokenAcesso.js');

router.post(
    '/',
    middlewareAcceso.verificarTokenAcesso,
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').optional(),
    body('dueDate')
        .isISO8601().withMessage('La fecha límite no es válida')
        .custom((value) => {
            const fechaLimite = new Date(value);
            const fechaActual = new Date();
            if (fechaLimite < fechaActual) {
                throw new Error('La fecha límite no puede ser anterior a la fecha actual');
            }
            return true;
        }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    },
    crearTarea
);
router.get(
    '/',
    middlewareAcceso.verificarTokenAcesso,
    obtenerTareas
);
router.put(
    '/:id',
    middlewareAcceso.verificarTokenAcesso,
    body('title'),
    body('description'),
    body('estado').isNumeric().withMessage('El estado es incorrecto'),
    body('dueDate').isDate().withMessage('La fecha límite no es válida')
        .custom((value) => {
            const fechaLimite = new Date(value);
            const fechaActual = new Date();
            if (fechaLimite < fechaActual) {
                throw new Error('La fecha límite no puede ser anterior a la fecha actual');
            }
            return true;
        }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    },
    actualizarTarea
);
router.delete(
    '/:id',
    middlewareAcceso.verificarTokenAcesso,
    eliminarTarea
);


module.exports = router;
