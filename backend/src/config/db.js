const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri !== 'embedded') {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Remote MongoDB unreachable. Using local embedded database.`);
    }
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbStoragePath = path.join(__dirname, '../../data');
    if (!fs.existsSync(dbStoragePath)) {
      fs.mkdirSync(dbStoragePath, { recursive: true });
    }

    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'standard_blog',
        dbPath: dbStoragePath,
        storageEngine: 'wiredTiger',
      },
    });

    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Embedded Persistent MongoDB active at: ${dbStoragePath}`);
    return conn;
  } catch (memErr) {
    console.warn(`[Database] Local persistence warning: ${memErr.message}. Fallback to memory instance.`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    return await mongoose.connect(memoryUri);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  } catch (e) {
    console.error('Error disconnecting DB:', e);
  }
};

module.exports = { connectDB, disconnectDB };
