const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const bookCtrl = require('../controllers/book');

router.get('/', auth, bookCtrl.getbooks);
router.get('/:id', auth, bookCtrl.getid);
router.get('/bestrating', auth, bookCtrl.getbestrating);
router.post('/', auth, bookCtrl.postbook);
router.put('/:id', auth, bookCtrl.putbookid);
router.delete('/:id', auth, bookCtrl.deletebookid);
router.post('/:id/rating', auth, bookCtrl.postbookidrating);

module.exports = router;