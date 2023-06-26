const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');

router.post('/', auth, multer, booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.ratingBook);
router.get('/bestrating', booksCtrl.getBestRatings);
router.get('/', booksCtrl.getAllBooks);

module.exports = router;