import { spawnSync } from 'child_process';
import { BadRequest, InternalError, Conflict } from '../Middlewares/ErrorHandler/ErrorUtils';
import { IRepository } from '../Schema/Repository';

/**
 * Lists all available Repositories
 * @throws Internal Error if something happens with executing script
 * @returns List of Repositories
 */
export function listRepositories(): string[] {
  const exec = spawnSync('sh', ['/home/scripts/list_repositories.sh']);
  if (exec.error)
    throw new InternalError('Could not list repositories 🐞');
  return exec
    .stdout
    .toString()
    .trim()
    .split('\n')
    .filter(elt => elt.length > 0)
}

/**
 * Creates new Repository given Repo Data
 * @param repo Repository Object
 * @throws Conflict on Duplicate or Internal Error handled by script
 * @returns Response as a split string
 */
export function createRepository(repo: IRepository): string[] {
  const exec = spawnSync('sh', [
    "/home/scripts/create_new_repository.sh",
    repo.title,
  ]);

  // Check for Errors
  if (exec.error || exec.status === 1)
    throw new BadRequest(exec.error.message);
  else if (exec.status === 2)
    throw new Conflict('Duplicate Repository 💥');
  

  return exec.stdout.toString().trim().split('\n');
}

/**
 * Removes given Repository
 * @param repoName Name of the repository to remove
 * @throws BadRequest if repository is not found
 * @returns String Array of response
 */
export function removeRepository(repoName: string): string[] {
  const exec = spawnSync('sh', [
    "/home/scripts/remove_repository.sh",
    repoName,
  ]);

  // Check for Errors
  if (exec.error || exec.status === 1)
    throw new BadRequest(exec.error.message);
  else if (exec.status === 2)
    throw new BadRequest('Repository not found 🔍');
  
  return exec.stdout.toString().trim().split('\n');
}
