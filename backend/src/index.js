// models
require('./models/User');
require('./models/Advert');
require('./models/Message');
require('./models/Conversation');
// libs
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const redisStorage = require('connect-redis')(session);
// const redis = require('redis');
// const client = redis.createClient();
// routes
const authRoutes = require('./routes/authRoutes');
const advertRoutes = require('./routes/advertRoutes');
const chatRoutes = require('./routes/chatRoutes');
// vars
const app = express();
const host = process.env.HOST;
const port = +process.env.PORT;
const mongoUri = process.env.DB_URI;
// utils
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//     session({
//         store: new redisStorage({ host, client, port: process.env.SESS_PORT, }),
//         secret: process.env.SECRET_KEY,
//         saveUninitialized: true
//     })
// )
// paths
app.use(authRoutes);
app.use(advertRoutes);
app.use(chatRoutes);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (error) => {
    console.error(error);
});

app.listen(port, host, () => {
    console.log(`Backend: ${host}:${port}`);
});