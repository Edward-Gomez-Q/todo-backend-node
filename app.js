var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

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

const front = process.env.URL_FRONTEND;
if (!front) {
  console.warn('ADVERTENCIA: URL_FRONTEND no está definida en las variables de entorno');
}
const corsOptions = {
  origin: front || 'http://localhost:3000', // URL del frontend o localhost como fallback
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));

// Rutas
app.use('/api/auth', usuarioRouter);
app.use('/api/tasks', tareaRouter);

module.exports = app;