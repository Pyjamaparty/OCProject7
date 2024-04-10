const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const Book = require('./models/book');
const User = require('./models/user');
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

app.post('/api/auth/login', (req, res, next) => {
    res.status(200).json();
});

app.get('/api/books', (req, res, next) => {
    Book.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
});

app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
});

app.get('/api/books/bestrating', (req, res, next) => {
    res.status(200).json();
});

app.post('/api/books', (req, res, next) => {
    delete req.body._id;
    const book = new Book({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Book enregistré !'}))
      .catch(error => res.status(400).json({ error }));
});

app.put('/api/books/:id', (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Book modifié !'}))
      .catch(error => res.status(400).json({ error }));
});

app.delete('/api/books/:id', (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Book supprimé !'}))
      .catch(error => res.status(400).json({ error }));
});

app.post('/api/books/:id/rating', (req, res, next) => {
    res.status(200).json();
});

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;