// models
require('./models/User');
// libs
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// routes
const authRoutes = require('./routes/authRoutes');
// middlewares
const requireAuth = require('./middlewares/requireAuth');
// vars
const app = express();
const port = 3000;
const mongoUri = 'mongodb+srv://proof:L6p4oFtOXePNfy75@cluster0-czjvw.mongodb.net/test?retryWrites=true&w=majority';
// utils
app.use(bodyParser.json());
// paths
app.use(authRoutes);

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
})

// TODO убрать пример использования middleware
// app.get('/', requireAuth, (req, res) => {
//     res.send(`Good! Your email: ${req.user.email}`)
// });

app.listen(port, () => {
    console.log(`Backend: localhost:${port}`);
})