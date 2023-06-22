const Book = require('../models/Book');

//add new book
exports.createBook = (req, res, next) => {
    //form-data to object
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    //use userId from token for security purposes
    delete bookObject._userId;
    //create book
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        //get image url 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //save book
    book.save()
        .then(() => res.status(201).json({ message: 'Book successfully created' }))
        .catch(error => res.status(400).json({ error }));
};

//get one specific book
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
}


//modify a book
exports.modifyBook = (req, res, next) => {
    const book = new Book({
        _id: req.params.id,
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        year: req.body.year,
        genre: req.body.genre
    });
    Book.updateOne({ _id: req.params.id }, book)
        .then(() => res.status(201).json({ message: 'Book updated successfully!' }))
        .catch(error => res.status(400).json({ error }));
};

//delete a book
exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Deleted!' }))
        .catch(error => res.status(400).json({ error }));
};

//get all books
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};