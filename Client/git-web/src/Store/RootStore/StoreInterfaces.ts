import { IRepository } from '../../Components/Repository';


export interface ISearchState {
  isSearching:    boolean,
  filteredRepos:  IRepository[],
}