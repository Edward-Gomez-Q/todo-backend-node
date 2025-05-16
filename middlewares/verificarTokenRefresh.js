const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { RefreshToken } = require('../models');
const ms = require('ms');
dotenv.config();

exports.verificarRefreshToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ mensaje: 'Token no proporcionado' });
        }
        const tokenWithoutBearer = authHeader.split(' ')[1];
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET_REFRESH);
        
        const token = await RefreshToken.findOne({ 
            where: { 
                token: tokenWithoutBearer, 
                revoked: false 
            } 
        });
        if (!token) {
            return res.status(401).json({ mensaje: 'Refresh token inválido o revocado' });
        }

        // Verificar si el refresh token ha expirado
        if (new Date() > new Date(token.expires_at)) {
            return res.status(401).json({ mensaje: 'Refresh token ha expirado' });
        }
        req.userId = decoded.id;
        req.refreshToken = token.dataValues.token;
        next();
    } catch (error) {
        switch (error.name) {
            case 'TokenExpiredError':
                return res.status(401).json({ mensaje: 'Token expirado' });
            case 'JsonWebTokenError':
                return res.status(401).json({ mensaje: 'Token inválido' });
            default:
                console.error(error);
                return res.status(500).json({ mensaje: 'Error al verificar el token' });
        }
    }
}