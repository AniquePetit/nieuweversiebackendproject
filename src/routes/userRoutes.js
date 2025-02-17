// src/routes/someRouter.js
import express from 'express';
import createUser from './userControllers.js'; // Zorg ervoor dat je pad klopt

const router = express.Router();

// POST route to create a user
router.post('/create', createUser);

export default router;
