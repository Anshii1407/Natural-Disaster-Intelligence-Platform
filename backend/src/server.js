import app from './app.js';
import connectDatabase from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (Graceful startup: continues running even if DB is offline)
connectDatabase();

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[Backend Service] Online and listening on port ${PORT}`);
  console.log(`[Backend Service] Health Check: http://localhost:${PORT}/api/health`);
  console.log(`[Backend Service] Architecture strictly aligned with the 4 approved modules + Phase 3 Auth.`);
});

export default server;
