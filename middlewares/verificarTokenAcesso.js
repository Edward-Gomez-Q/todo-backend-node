const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.verificarTokenAcesso = async (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ mensaje: 'Token no proporcionado' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error){
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