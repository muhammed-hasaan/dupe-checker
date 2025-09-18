// mongodb.js (Root level)
const { MongoClient } = require('mongodb');


const  MONGODB_URI = "mongodb+srv://dupcheck:dupcheck@cluster0.um8uqeh.mongodb.net/"
if (MONGODB_URI) {
  throw new Error('❌ MongoDB URI is missing in environment variables!');
}

// Cached variables for connection reuse
let cachedClient = null;
let cachedDb = null;

/**
 * Connects to MongoDB (with caching for serverless environments)
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
async function connectToDatabase() {
  // Return cached connection if it exists and is connected
  if (cachedClient && cachedClient.topology.isConnected()) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new MongoClient instance
  const client = new MongoClient(MONGODB_URI, {
    connectTimeoutMS: 5000,       // 5s to establish connection
    socketTimeoutMS: 30000,      // 30s of inactivity before timeout
    serverSelectionTimeoutMS: 5000, // 5s to select a server
    maxPoolSize: 5,              // Max 5 connections in pool
    minPoolSize: 1,              // Keep 1 connection open
    retryWrites: true,           // Automatic retry for writes
    retryReads: true,            // Automatic retry for reads
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db('dupechecker'); 

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    console.log('✅ MongoDB connected successfully');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    await client.close(); // Clean up
    throw new Error('Failed to connect to MongoDB');
  }
}

// Handle serverless function cleanup (important for Vercel)
process.on('beforeExit', async () => {
  if (cachedClient) {
    await cachedClient.close();
    console.log('🔌 MongoDB connection closed');
  }
});

process.on('uncaughtException', async (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  if (cachedClient) await cachedClient.close();
  process.exit(1);
});

process.on('unhandledRejection', async (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
  if (cachedClient) await cachedClient.close();
  process.exit(1);
});

module.exports = connectToDatabase;
