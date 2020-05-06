// models
require('./models/User');
require('./models/Advert');
// libs
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// routes
const authRoutes = require('./routes/authRoutes');
const advertRoutes = require('./routes/advertRoutes');
// vars
const app = express();
const port = 3000;
const mongoUri = 'mongodb+srv://proof:L6p4oFtOXePNfy75@cluster0-czjvw.mongodb.net/test?retryWrites=true&w=majority';
// utils
app.use(bodyParser.json());
// paths
app.use(authRoutes);
app.use(advertRoutes);

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

app.listen(port, () => {
    console.log(`Backend: http://localhost:${port}`);
})