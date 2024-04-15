const Book = require('../models/book');
const fs = require('fs');

exports.getbooks = (req, res, next) => {
  console.log('getbooks');
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getid = (req, res, next) => {
  console.log('getid2');
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getbestrating = (req, res, next) => {
  console.log('getbestrating');
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.postbook = (req, res, next) => {
  console.log('postbook');
  const bookData = JSON.parse(req.body.book);
  const book = new Book({
    ...bookData,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Book enregistré !' }))
    .catch(error => {
      console.error(error);
      res.status(400).json({ error });
    });
};

exports.putbookid = (req, res, next) => {
  console.log('putBookId');
  let bookData = req.body;
  if (req.body.book) {
    bookData = JSON.parse(req.body.book);
  }
  const update = {
    ...bookData,
  };
  if (req.file) {
    update.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  Book.updateOne({ _id: req.params.id }, update)
    .then(() => res.status(200).json({ message: 'Book updated!' }))
    .catch(error => {
      console.error(error);
      res.status(400).json({ error });
    });
};

exports.deletebookid = (req, res, next) => {
  console.log('deletebookid');
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.postbookidrating = (req, res, next) => {
  console.log('postbookidrating');
  const userId = req.body.userId;
  const grade = req.body.rating;

  // Check if the rating is between 0 and 5
  if (grade < 0 || grade > 5) {
    return res.status(400).json({ error: 'Rating must be between 0 and 5' });
  }

  Book.findOne({ _id: req.params.id })
    .then(book => {
      // Check if the user has already rated this book
      const hasRated = book.ratings.some(rating => rating.userId === userId);
      if (hasRated) {
        // If the user has already rated, do nothing
        res.status(200).json({ message: 'User has already rated this book' });
      } else {
        // If the user hasn't rated, add their rating
        book.ratings.push({ userId, grade });
        // Recalculate the average rating
        const total = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        book.averageRating = total / book.ratings.length;
        // Save the updated book
        book.save()
          .then(() => {
            const bookObject = book.toObject();
            res.status(201).json(bookObject);
          })
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(404).json({ error }));
};