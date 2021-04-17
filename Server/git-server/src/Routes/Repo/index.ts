import { Router } from 'express';
import { IRepository, RepositorySchema } from '../../Schema/Repository';
import { BadRequest, InternalError } from '../../Middlewares/ErrorHandler/ErrorUtils';
import { spawnSync } from 'child_process';
const app = Router();


/**
 * @param req: None
 * @param res: Fetches List of all Repositories on the Server
 */
app.get('/', (_, res) => {
  const exec = spawnSync('sh', ['/home/git/scripts/list_repositories.sh']);
  if (exec.error)
    throw new InternalError('Could not list repositories 🐞');

  res.json({
    message: 'Repository List Successfull! 📦',
    data: exec
      .stdout
      .toString()
      .trim()
      .split('\n'),
  });
});

/**
 * @param req: Params have the Repository ID
 * @param res: Fetches given Repository
 */
app.get('/:title', (req, res) => {
  const { title } = req.params;

  // Get Repository List
  const exec = spawnSync('sh', ['/home/git/scripts/list_repositories.sh']);
  if (exec.error)
    throw new InternalError('Could not list repositories 🐞');

  // Assign target '.git' to the end if not given
  const target = /.*.git/i.test(title) ? title.toLowerCase() : `${title.toLowerCase()}.git`;
  
  // Search for Repository
  const repoResult = exec
    .stdout
    .toString()
    .trim()
    .split('\n')
    .filter(repo => target === repo.toLowerCase())

  res.json({
    message: repoResult.length ? 'Repository Search found. 🚀' : 'Repository not found 😪',
    data: repoResult.length ? repoResult[0] : null,
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

  // TODO: Check for Duplicate prior to creating repository
  
  // Execute & Check for Errors
  const exec = spawnSync('sh', [
    "/home/git/scripts/create_new_repository.sh",
    body.title,
  ]);
  
  if (exec.error) {
    throw new BadRequest(exec.error.message);
  }
  
  res.json({
    message: `Repository "${body.title}" created successfuly 📦!`,
    debug: exec.stdout.toString().trim().split('\n'),
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