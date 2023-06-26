const Book = require('../models/Book');

//#### add new book #####
exports.createBook = (req, res, next) => {
    //form-data to object
    const bookObject = JSON.parse(req.body.book);
    const grade = bookObject.ratings.grade;
    delete bookObject._id;
    //use userId from token for security purposes
    delete bookObject._userId;
    delete bookObject.ratings;
    //create book
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        ratings: [],
        averageRating: 0,
        //get image url 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //save book
    book.save()
        .then(() => res.status(201).json({ message: 'Book successfully created' }))
        .catch(error => res.status(400).json({ error }));
};

//#### get one specific book ####
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

//#### rate book ####
exports.ratingBook = (req, res, next) => {
    const updatedRating = {
        userId: req.auth.userId,
        grade: req.body.rating
    };
    console.log(updatedRating);

    //check rating range
    if (updatedRating.grade < 0 || updatedRating.grade > 5) {
        return res.status(400).json({ message: 'rating must be between 0 and 5' });
    }
    //find book and push new rating in array
    Book.findOneAndUpdate({ _id: req.params.id }, { $push: { ratings: updatedRating } }, { new: true })
        .then((book) => {
            //average rating calculation 
            //no need to go through all array, sum of ratings is average rating * rating length (minus the new rate that is added)
            book.averageRating = (book.averageRating * (book.ratings.length - 1) + updatedRating.grade) / book.ratings.length;
            console.log(book.averageRating);
            return book.save();
        })
        .then((updatedBook) => res.status(200).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
}


//#### modify a book ####
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

//#### delete a book ####
exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Deleted!' }))
        .catch(error => res.status(400).json({ error }));
};

//#### get all books ####
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

//#### get best 3 best rated books ####
exports.getBestRatings = (req, res, next) => {
    Book.find()
        //sort by descending order
        .sort({ averageRating: -1 })
        //keep the first 3 books (best)
        .limit(3)
        //return array of 3 best rated books
        .then((bestBooks) => res.status(200).json(bestBooks))
        .catch(error => res.status(400).json({ error }));
}