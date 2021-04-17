import { Router } from 'express';
import { IRepository, RepositorySchema } from '../../Schema/Repository';
import { BadRequest } from '../../Middlewares/ErrorHandler/ErrorUtils';
import * as Repo from '../../Actions/Repository';
const app = Router();


/**
 * @param req: None
 * @param res: Fetches List of all Repositories on the Server
 */
app.get('/', (_, res) => {
  res.json({
    message: 'Repository List Successfull! 📦',
    data: Repo.listRepositories(),
  });
});

/**
 * @param req: Params have the Repository ID
 * @param res: Fetches given Repository
 */
app.get('/:title', (req, res) => {
  const { title } = req.params;

  // Get Repository List
  const repoList = Repo.listRepositories();

  // Assign target '.git' to the end if not given
  const target = /.*.git/i.test(title) ? title.toLowerCase() : `${title.toLowerCase()}.git`;
  
  // Search for Repository
  const repoResult = repoList
    .filter(repo => target === repo.toLowerCase())

  res.json({
    message: repoResult.length ? 'Repository Search found. 🚀' : 'Repository not found 😪',
    data: repoResult.length ? {
      name: repoResult[0],
      link: `git@localhost:${repoResult[0]}`,
    } : null,
  });
});

/**
 * @param req JSON Body following the Repository Interface
 * @param res Status of Repository Creation
 */
app.post('/', (req, res) => {
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
  
  res.json({
    message: `Repository "${body.title}" created successfuly 📦!`,
    debug: creationResult,
  });
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