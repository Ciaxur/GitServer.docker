
// Repository Interface
export interface IRepository {
  title:        string,
  description?: string,
  lastUpdated:  Date,
}

/**
 * User-Defined Type Checking
 * @obj Any object checking if of type IRepository
 * @returns if Object is of type IRepository
 */
export const isRepository = (obj: any): obj is IRepository => {
  return (
    (obj as IRepository).title        !== undefined &&
    (obj as IRepository).lastUpdated  !== undefined
  );
};

/**
 * User-Defined Type Checking
 * @arr Any object checking if of type IRepository Array
 * @returns if Array is of type IRepository Array
 */
export const isRepositoryArray = (arr: any | any[]): arr is IRepository[] => {
  // Early Return
  if (!(arr instanceof Array))
    return false;
  
  // Check each element to be of type IRepository
  for (const elt of arr) {
    if (!isRepository(elt))
      return false;
  }

  // All checks out
  return true;
};