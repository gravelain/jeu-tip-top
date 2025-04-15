const express = require('express');
const router = express.Router();
const { contactController } = require('../controllers/contactController');

// Route pour le formulaire de contact
router.post('/contact', contactController);

module.exports = router;
