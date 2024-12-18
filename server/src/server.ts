import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// ES Module compatible replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// SPA fallback for frontend routing
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
