// Importeer dotenv en configureer het
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.AUTH_SECRET_KEY);  // Moet 'Winc123' uitprinten
console.log(process.env.SENTRY_DSN);  // Moet de Sentry DSN uitprinten

// Importeer instrument.js (zorg ervoor dat het bestand bestaat)
import './instrument.js';

// Importeer de benodigde afhankelijkheden
import express from 'express';
import * as Sentry from '@sentry/node';
import prisma from './prismaClient';  // Prisma Client voor database interacties
import userRoutes from './routes/userRoutes';  // Je routes voor gebruikers

// Initialiseer express
const app = express();

// Stel Sentry in
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Middleware voor JSON parsing
app.use(express.json());

// Gebruik je routes
app.use('/users', userRoutes);  // Dit betekent dat je via POST naar /users/create kunt sturen om een gebruiker aan te maken

// Error handler voor Sentry
Sentry.setupExpressErrorHandler(app);

// Fallback error handler (als er iets fout gaat)
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

// Start de server op poort 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
