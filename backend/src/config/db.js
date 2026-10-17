import mongoose from 'mongoose';

let isConnecting = false;

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    console.warn('[Database] MONGODB_URI is not configured in .env. Operating without active database connection.');
    return false;
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return true;
  }

  isConnecting = true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    isConnecting = false;
    return true;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    isConnecting = false;
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB Atlas Disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB runtime error: ${err.message}`);
});

export const getDatabaseStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const state = states[mongoose.connection.readyState] || 'unknown';

  return {
    status: state,
    isConnected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

export default connectDatabase;
