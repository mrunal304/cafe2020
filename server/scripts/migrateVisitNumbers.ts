import mongoose from 'mongoose';
import { MongoCustomerCard, MongoQueueEntry } from '../../shared/mongo-schema.js';

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function migrateVisitNumbers() {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log('Connected to MongoDB');
    
    // Get all queue entries
    const allEntries = await MongoQueueEntry.find({})
      .sort({ bookingDateTime: 1 }); // Oldest first
    
    console.log(`Found ${allEntries.length} total queue entries`);
    
    // Group by phone number
    const phoneGroups: Record<string, any[]> = {};
    
    allEntries.forEach(entry => {
      const phone = entry.phoneNumber;
      if (!phoneGroups[phone]) {
        phoneGroups[phone] = [];
      }
      phoneGroups[phone].push(entry);
    });
    
    console.log(`Found ${Object.keys(phoneGroups).length} unique customers`);
    
    let processedCount = 0;
    
    // Process each customer
    for (const [phoneNumber, entries] of Object.entries(phoneGroups)) {
      // Sort entries by date (oldest first)
      entries.sort((a, b) => 
        new Date(a.bookingDateTime).getTime() - new Date(b.bookingDateTime).getTime()
      );
      
      // Find or create customer card
      let customerCard = await MongoCustomerCard.findOne({ phoneNumber });
      
      if (!customerCard) {
        const firstEntry = entries[0];
        const lastEntry = entries[entries.length - 1];
        
        customerCard = await MongoCustomerCard.create({
          phoneNumber,
          name: firstEntry.name,
          email: null,
          totalVisits: entries.length,
          firstVisitDate: firstEntry.bookingDateTime,
          lastVisitDate: lastEntry.bookingDateTime,
          visits: entries.map(e => e._id),
          createdAt: firstEntry.bookingDateTime,
          updatedAt: new Date()
        });
        console.log(`Created customer card for ${phoneNumber}`);
      }
      
      // Update each entry with visitNumber
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const visitNumber = i + 1;
        
        await MongoQueueEntry.updateOne(
          { _id: entry._id },
          {
            $set: {
              customerCardId: customerCard._id,
              visitNumber: visitNumber
            }
          }
        );
      }
      
      // Update customer card with correct data
      await MongoCustomerCard.updateOne(
        { _id: customerCard._id },
        {
          $set: {
            totalVisits: entries.length,
            visits: entries.map(e => e._id),
            firstVisitDate: entries[0].bookingDateTime,
            lastVisitDate: entries[entries.length - 1].bookingDateTime,
            updatedAt: new Date()
          }
        }
      );
      
      processedCount++;
      console.log(`[${processedCount}/${Object.keys(phoneGroups).length}] Processed ${phoneNumber}: ${entries.length} visits`);
    }
    
    console.log('\n✅ Migration complete!');
    console.log(`- Customers processed: ${processedCount}`);
    console.log(`- Total entries updated: ${allEntries.length}`);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

migrateVisitNumbers();