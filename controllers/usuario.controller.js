const {Usuario} = require('../models');
const {RefreshToken} = require('../models');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ms = require('ms');

const dotenv = require('dotenv');
dotenv.config();



//Crear un nuevo usuario
exports.registrarUsuario = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Verificar si el usuario ya existe mediante del email
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }
        // Crear nuevo usuario
        const nuevoUsuario = await Usuario.create({
            nombre: name,
            email,
            contrasena: bcrypt.hashSync(password, 10),
        });
        const { contrasena, ...usuarioSinContrasena } = nuevoUsuario.toJSON();
        return res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: usuarioSinContrasena });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al registrar el usuario' });
    }
}

//Iniciar sesión
exports.iniciarSesion = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const contrasenaValida = bcrypt.compareSync(password, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar access token
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        // Generar refresh token
        const refreshToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.JWT_EXPIRES_IN_REFRESH });
        
        // Revocar refresh tokens anteriores
        await RefreshToken.update({ revoked: true }, { where: { user_id: usuario.id } });
        
        // Guardar refresh token en la base de datos
        const refreshTokenExpiresAt = new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN_REFRESH));
        await RefreshToken.create({
            user_id: usuario.id,
            token: refreshToken,
            expires_at: refreshTokenExpiresAt,
            revoked: false
        });
        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            accessToken: token,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
}
//Generar un nuevo access token
exports.generarNuevoAccessToken = async (req, res) => {
    try {
        const nuevoAccessToken = jwt.sign({ id: req.userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        // Revocar el refresh token actual y generar uno nuevo
        await RefreshToken.update({ revoked: true }, { where: { token: req.refreshToken } });
        const newRefreshToken = jwt.sign({ id: req.userId }, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.JWT_EXPIRES_IN_REFRESH });
        const refreshTokenExpiresAt = new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN_REFRESH));
        await RefreshToken.create({
            user_id: req.userId,
            token: newRefreshToken,
            expires_at: refreshTokenExpiresAt,
            revoked: false
        });
        return res.status(200).json({
            mensaje: 'Nuevo access token generado',
            accessToken: nuevoAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al generar nuevo access token' });
    }
}
//Cerrar sesión
exports.cerrarSesion = async (req, res) => {
    try {
        // Revocar el refresh token
        await RefreshToken.update({ revoked: true }, { where: { token: req.refreshToken } });
        return res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
    }
}
//Obtener datos del usuario con access token}
exports.obtenerDatosUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const { contrasena, ...usuarioSinContrasena } = usuario.toJSON();
        return res.status(200).json(usuarioSinContrasena);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al obtener datos del usuario' });
    }
}






