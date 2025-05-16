const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const { crearTarea } = require('../controllers/tarea.controller.js');
const middlewareAcceso = require('../middlewares/verificarTokenAcesso.js');
const middlewareRefresh = require('../middlewares/verificarTokenRefresh.js');
const autorizacionPorId = require('../middlewares/autorizacionId.js');

router.post(
    '/',
    middlewareAcceso.verificarTokenAcesso,
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description'),
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
    crearTarea
);

module.exports = router;
