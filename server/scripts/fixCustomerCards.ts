import mongoose from 'mongoose';
import { MongoCustomerCard, MongoQueueEntry } from '../../shared/mongo-schema.js';

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function fixCustomerCards() {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log('Connected to MongoDB');

    const customerCards = await MongoCustomerCard.find({});
    console.log(`Found ${customerCards.length} customer cards to fix`);

    for (const card of customerCards) {
      const visits = await MongoQueueEntry.find({ customerCardId: card._id })
        .sort({ bookingDateTime: 1 });

      if (visits.length === 0) {
        console.log(`Customer ${card.phoneNumber} has no visits. Skipping.`);
        continue;
      }

      const totalVisits = visits.length;
      const visitIds = visits.map(v => v._id);
      const firstVisitDate = visits[0].bookingDateTime;
      const lastVisitDate = visits[visits.length - 1].bookingDateTime;

      await MongoCustomerCard.updateOne(
        { _id: card._id },
        {
          $set: {
            email: card.email || null,
            totalVisits: totalVisits,
            visits: visitIds,
            firstVisitDate: firstVisitDate,
            lastVisitDate: lastVisitDate,
            updatedAt: new Date()
          }
        }
      );

      console.log(`Updated customer ${card.phoneNumber}: ${totalVisits} visits`);
    }

    console.log('\n✅ Customer cards fix complete!');
  } catch (error) {
    console.error('❌ Fix error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

fixCustomerCards();