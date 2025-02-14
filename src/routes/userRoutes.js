import express from 'express';
import createUser from '../routes/userControllers.js'; // Import default export

const router = express.Router();

// POST route to create a user
router.post('/create', createUser);

export default router;
