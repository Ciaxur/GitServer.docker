/**
 * Express App that acts as an API to interact
 *  with repositories on the server.
 */

// Express Library Import
import express from  'express';
import cors from 'cors';
import morgan from 'morgan';
import methodOverride from 'method-override';

// Import & Initialize Database Connection
import { RepositoryDB } from './Database';
console.log('Initializing Database...');
RepositoryDB.createDbInstance(process.env.MONGODB_URL);

// Initialize Express app & Configure
const app = express();
app.use(cors({ origin: '*' }));
app.use(morgan('tiny'));
app.use(express.json({
  limit: '1mb',
}));

// Initialize Repository Watcher
import { RepoWatcher } from './Routes/Repo/Watcher';
console.log('Initializing RepoWatcher...');
RepoWatcher.Init();

// Route & Middleware Imports
import { Repo } from './Routes';
import ErrorHandler from './Middlewares/ErrorHandler';

// Bind Routes
app.use('/repo', Repo);

// Bind Error Handlers
app.use(methodOverride());
app.use(ErrorHandler);

// Not found Route
app.use('/*', (_, res) => {
  res
    .status(404)
    .json({ message: 'Not Found 😾'})
});

// Bind & Listen on Port
console.log('GitServer: Listening on port 3000');
app.listen(3000);

// Clean up after process close
process.on('exit', () => {
  // Close Database Connection
  console.log('Closing Database...');
  const db = RepositoryDB.getDbInstance();

  // Close Repository Watcher
  console.log('Closing RepoWatcher...');
  RepoWatcher.Stop();
  
  if (db)
    db.close();
});