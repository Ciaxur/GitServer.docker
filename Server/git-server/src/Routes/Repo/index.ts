import { Router } from 'express';
import { IRepository, RepositorySchema } from '../../Schema/Repository';
import { BadRequest } from '../../Middlewares/ErrorHandler/ErrorUtils';
import * as Repo from '../../Actions/Repository';
const app = Router();

// Import Database
import { RepositoryDB } from '../../Database';
const db = RepositoryDB.getDbInstance();

// Process Env Variables
const DEBUG_ENABLE = process.env.DEBUG_ENABLE 
  ? process.env.DEBUG_ENABLE.toLowerCase() === 'true'
  : false;

/**
 * @param req: None
 * @param res: Fetches List of all Repositories on the Server
 */
app.get('/', async (_, res) => {
  res.json({
    message: 'Repository List Successfull! 📦',
    data: await db.getAll(),
  });
});

/**
 * @param req: Parameter has the Repo Title
 * @param res: Fetches given Repository
 */
app.get('/:title', async (req, res) => {
  const { title } = req.params;

  const repoResult = await db.get(title.toLowerCase());

  res.json({
    message: repoResult.length ? 'Repository Search found. 🚀' : 'Repository not found 😪',
    data: repoResult.length ? {
      name: repoResult[0].title,
      link: `git@localhost:${repoResult[0].title}.git`,
    } : null,
  });
});

/**
 * @param req JSON Body following the Repository Interface
 * @param res Status of Repository Creation
 */
app.post('/', (req, res, next) => {
  // Assume body is valid & then Validate on Schema
  const body: IRepository = req.body;
  const bodyValidation = RepositorySchema.validate(body);
  if (bodyValidation.error || hasSpace(body.title)) {
    throw new BadRequest(
      'Invalid Request',
      bodyValidation.error
        ? bodyValidation
        : 'Title has spaces'
    );
  }

  // Execute & Check for Errors
  const creationResult = Repo.createRepository({
    title: body.title,
  });

  // Create a DB Entry
  db.insert({
    title: body.title,
    description: body.description,
  })
    .then(dbEntry => {
      res.json({
        message: `Repository "${body.title}" created successfuly 📦!`,
        debug: DEBUG_ENABLE ? { creationResult, dbEntry } : undefined,
      });
    })
    .catch(err => next(err));
});


/**
 * @param req: Parameter has the Repo Title
 * @param res: Result of Removing Repository
 */
app.delete('/:title', (req, res) => {
  const { title } = req.params;
  
  // Remove Repository Directory
  const removalResponse = Repo.removeRepository(title);

  // Remove entry from DB
  db.remove(title);

  res.json({
    message: 'Removed Repository 🗑',
    debug: DEBUG_ENABLE ? removalResponse : undefined,
  });
})

/**
 * @param req: Parameter for the Repo Title & Body object of updated Repo
 * @param res: Result of Updated Repository
 * @returns 
 */
app.patch('/:title', async (req, res, next) => {
  const { title } = req.params;

  // Assume body is valid & then Validate on Schema
  const body: IRepository = req.body;
  const bodyValidation = RepositorySchema.validate(body);
  if (bodyValidation.error || hasSpace(body.title)) {
    return next(new BadRequest(
      'Invalid Request',
      bodyValidation.error
        ? bodyValidation
        : 'Title has spaces'
    ));
  }
  
  // Update Repository TODO: Add Script
  try {
    Repo.renameRepository(title, body.title);
  } catch (e) {
    return next(e);
  }

  // Update DB
  const updateResponse = await db.update(title, {
    title: body.title,
    description: body.description,
  });

  // Validate DB Updated
  if (updateResponse === null)
    return next(new BadRequest('Repository not found'));
  
  res.json({
    message: 'Repository updated successfully! 🧉',
    debug: DEBUG_ENABLE ? {
      updateResponse,
    } : undefined,
  })
});

// Helper Functions
/**
 * Checks for Spaces in String
 * @param str String to check
 */
function hasSpace(str: string): boolean {
  for (const c of str) {
    if (c === " ") return true;
  }
  return false;
}

export default app;