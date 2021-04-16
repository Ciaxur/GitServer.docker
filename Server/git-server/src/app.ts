/**
 * Express App that acts as an API to interact
 *  with repositories on the server.
 */

// Express Library Import
import express from  'express';
import cors from 'cors';

// Initialize Express app & Configure
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({
  limit: '1mb',
}));

// Route Imports
import { Repo } from './Routes';

// Bind Routes
app.use('/repo', Repo);


// Bind & Listen on Port
console.log('GitServer: Listening on port 3000');
app.listen(3000);