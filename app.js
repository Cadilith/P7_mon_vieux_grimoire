const express = require('express');
const mongoose = require('mongoose');

const Book = require('./models/Book');

const app = express();

mongoose.connect('mongodb+srv://tiffanieorsoni:CgMb2IXKbnH3zjBX@cluster0.r42tbpu.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.post('/api/books', (req, res, next) => {
    delete req.body._id;
    const book = new Book({
        ...req.body
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Book successfully postred' }))
        .catch(error => res.status(400).json({ error }))
});

app.use('/api/books', (req, res, next) => {
    const books = [

    ];
    res.status(200).json(books);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

module.exports = app;