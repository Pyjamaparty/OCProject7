const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');


mongoose.connect('mongodb+srv://camillebertin1992:DBSysAZ82A6qw7MD@ocproject7.ztwgevy.mongodb.net/?retryWrites=true&w=majority&appName=OCProject7',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;