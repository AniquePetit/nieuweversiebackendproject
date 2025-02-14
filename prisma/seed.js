import { PrismaClient } from '@prisma/client';  // Gebruik 'import' i.p.v. 'require'
import bcrypt from 'bcryptjs';  // Voeg bcrypt toe voor wachtwoord hashing

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash het wachtwoord voor de gebruiker
  const hashedPassword = await bcrypt.hash('hashedpassword123', 10);

  // Voeg een User toe met een unieke gebruikersnaam en e-mailadres
  const user = await prisma.user.create({
    data: {
      username: `johndoe${Date.now()}`,  // Unieke gebruikersnaam met timestamp
      email: `johndoe${Date.now()}@example.com`,  // E-mailadres aangepast met timestamp voor uniciteit
      password: hashedPassword, // Gehasht wachtwoord opslaan
    },
  });

  // Voeg een Host toe met een uniek e-mailadres
  const host = await prisma.host.create({
    data: {
      name: 'Linda Smith',
      email: `linda${Date.now()}@example.com`,  // E-mailadres aangepast met timestamp voor uniciteit
    },
  });

  // Voeg een Property toe en koppel deze aan de Host
  const property = await prisma.property.create({
    data: {
      title: 'Gezellig strandhuis',
      location: 'Malibu, California',
      pricePerNight: 310.25,
      hostId: host.id, // Koppel aan Host
    },
  });

  // Voeg Amenities toe
  const wifi = await prisma.amenity.create({
    data: { name: 'Wifi' },
  });

  const pool = await prisma.amenity.create({
    data: { name: 'Zwembad' },
  });

  // Koppel Amenities aan Property
  await prisma.property.update({
    where: { id: property.id },
    data: { amenities: { connect: [{ id: wifi.id }, { id: pool.id }] } },
  });

  // Bereken de totaalprijs van de Booking
  const startDate = new Date('2025-06-01');
  const endDate = new Date('2025-06-07');
  const totalPrice = (endDate - startDate) / (1000 * 3600 * 24) * property.pricePerNight; // Bereken het aantal nachten en vermenigvuldig met de prijs per nacht

  // Voeg een Booking toe
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice, // Voeg de berekende prijs toe
    },
  });

  // Voeg een Review toe
  const review = await prisma.review.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      rating: 5,
      comment: 'Geweldige plek! Zeker een aanrader.',
    },
  });

  console.log('Seeding voltooid! 🎉');
}

// Voer de main functie uit
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });  // <-- Zorg ervoor dat deze regel er is! Dit sluit de verbinding netjes af.
