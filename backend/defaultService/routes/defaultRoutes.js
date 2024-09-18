// defaultService/routes/defaultRoutes.js

const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');

router.get('/', defaultController.getAlldefaults);
router.post('/', defaultController.createdefault);
router.get('/:id', defaultController.getdefaultById);
router.put('/:id', defaultController.updatedefault);
router.delete('/:id', defaultController.deletedefault);

module.exports = router;

