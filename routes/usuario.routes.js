const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const { registrarUsuario, iniciarSesion, generarNuevoAccessToken, cerrarSesion, obtenerDatosUsuario } = require('../controllers/usuario.controller.js');
const middlewareAcceso = require('../middlewares/verificarTokenAcesso.js');
const middlewareRefresh = require('../middlewares/verificarTokenRefresh.js');
const autorizacionPorId = require('../middlewares/autorizacionId.js');
//Crear un nuevo usuario
router.post(
    '/register',
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    },
    registrarUsuario
);
//Iniciar sesión
router.post('/login', 
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    },
    iniciarSesion
);
//Obtener datos del usuario
router.get('/me', middlewareAcceso.verificarTokenAcesso, obtenerDatosUsuario);
//Cerrar sesión
router.post('/logout', middlewareRefresh.verificarRefreshToken, cerrarSesion);
//Generar nuevo access token
router.post('/refresh', middlewareRefresh.verificarRefreshToken, generarNuevoAccessToken);

module.exports = router;