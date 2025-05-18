var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usuarioRouter = require('./routes/usuario.routes.js');
var tareaRouter = require('./routes/tarea.routes.js');
const dotenv = require('dotenv');
dotenv.config();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de CORS
const front = process.env.FR
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
// Rutas
app.use('/api/auth', usuarioRouter);
app.use('/api/tasks', tareaRouter);


module.exports = app;
