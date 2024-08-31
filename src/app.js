import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import ViewsRouter from './routes/ViewsRouter.js';
import sessionRouter from './routes/sessions.router.js';
import SessionsRouter from './routes/SessionsRouter.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import config from './config/config.js';
import initializePassportConfig from './config/passport.config.js';

const app = express();
const PORT = config.app.PORT;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const connection = mongoose.connect(config.mongo.URL)
const io = new Server(server);

// Setup view engine
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Middleware setup
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    req.io = io;
    next();
});

initializePassportConfig();
app.use(passport.initialize());

// Routes setup
app.use('/', ViewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', SessionsRouter);

app.use('*', (req, res) => {
    res.status(404).render('404');  
});

io.on('connection', (socket) => {
    console.log('Socket connected');
});
