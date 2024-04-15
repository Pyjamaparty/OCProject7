const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getbooks);
router.get('/bestrating', bookCtrl.getbestrating);
router.get('/:id', bookCtrl.getid);
router.post('/', auth, multer, bookCtrl.postbook);
router.put('/:id', auth, multer, bookCtrl.putbookid);
router.delete('/:id', auth, bookCtrl.deletebookid);
router.post('/:id/rating', auth, bookCtrl.postbookidrating);

module.exports = router;
