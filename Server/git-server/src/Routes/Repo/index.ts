import { Router } from 'express';
import { IRepository, RepositorySchema } from '../../Schema/Repository';
const app = Router();


/**
 * @param req: None
 * @param res: Fetches List of all Repositories on the Server
 */
app.get('/', (_, res) => {
  res.json({
    message: '🚀',
  });
});

/**
 * @param req: Params have the Repository ID
 * @param res: Fetches given Repository
 */
app.get('/:id', (req, res) => {
  const { params } = req;
   
  res.json({
    params,
    message: '🚀',
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
    return res
      .status(400)
      .json({
        error: {
          message: 'Invalid Request',
          debug: bodyValidation.error
            ? bodyValidation
            : 'Title has spaces',
        },
    });
  }
   
  // TODO: Ensure NO spaces
  res.json({
    message: '🚀',
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