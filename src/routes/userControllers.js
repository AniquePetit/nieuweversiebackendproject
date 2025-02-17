// src/routes/userControllers.js
import bcrypt from 'bcrypt';
import prisma from '../prisma/prismaClient.js';  // Gebruik default import
import * as Sentry from '@sentry/node';

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ error: 'Error creating user' });
  }
}

// Default export of createUser
export default createUser;
