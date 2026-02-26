const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

async function addCreatedAt() {
  try {
    const result = await User.updateMany(
      { createdAt: { $exists: false } },
      { 
        $set: { 
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`✓ Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addCreatedAt();