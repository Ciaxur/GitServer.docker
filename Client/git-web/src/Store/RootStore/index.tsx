import React from 'react';
import { ISearchState } from './StoreInterfaces';
import { IRepository, isRepository, isRepositoryArray } from '../../Components/Repository';


export interface IRootStore {
  store: {
    // Internal State for Routing
    routePath:      string,

    // Repository Store
    repoStore: {
      loaded:     boolean,
      repoList:   IRepository[],

      // Search State
      searchState: ISearchState,
    },
  },
  dispatch: React.Dispatch<IRootStoreAction>,
}

export interface IRootStoreAction {
  type: 'SET_ROUTE'        | 'SET_REPO_LIST'    | 
        'ADD_REPO'         | 'REM_REPO'         | 
        'SET_SEARCH_STATE' | 'SET_IS_SEARCHING',
  payload: boolean | string | IRepository | IRepository[] | ISearchState,
  store?: IRootStore,
}

export const RootStoreReducer = (state: IRootStore, action: IRootStoreAction): IRootStore => {
  const { payload, type } = action;

  switch (type) {
    case 'SET_ROUTE':
      // Validate Payload Type
      if (typeof payload !== 'string')
        return state;
      
      return {
        ...state,
        store: {
          ...state.store,
          routePath: payload,
        },
      };

    case 'SET_REPO_LIST':
      // Validate Payload Type
      if (!isRepositoryArray(payload)) {
        return state;
      }
        
      return {
        ...state,
        store: {
          ...state.store,
          repoStore: {
            ...state.store.repoStore,
            loaded:   true,
            repoList: payload,
          },
        },
      };

    case 'ADD_REPO':
      // Validate Payload Type
      if (!isRepository(payload))
        return state;
      
      return {
        ...state,
        store: {
          ...state.store,
          repoStore: {
            ...state.store.repoStore,
            repoList: state.store.repoStore.repoList.concat(payload),
          },
        },
      };
    
    case 'REM_REPO':
      return {
        ...state,
        store: {
          ...state.store,
          repoStore: {
            ...state.store.repoStore,
            repoList: state.store.repoStore.repoList.filter(repo => repo.title != payload),
          },
        },
      };

    case 'SET_SEARCH_STATE':
      return {
        ...state,
        store: {
          ...state.store,
          repoStore: {
            ...state.store.repoStore,

            // NOTE: Starts Here
            searchState: payload as ISearchState,
          },
        },
      };

    case 'SET_IS_SEARCHING':
      return {
        ...state,
        store: {
          ...state.store,
          repoStore: {
            ...state.store.repoStore,

            // NOTE: Starts Here
            searchState: {
              ...state.store.repoStore.searchState,
              isSearching: payload as boolean,
            },
          },
        },
      };
    default:
      return state;
  }
};

export const RootStoreDefault: Partial<IRootStore> = {
  store: {
    routePath: '/',
    repoStore: {
      loaded: false,
      repoList: [],

      searchState: {
        isSearching: false,
        filteredRepos: [],
      },
    },
  },
};

export const RootStoreContext = React.createContext<IRootStore>(RootStoreDefault as IRootStore);

// FORWARD EXPORT ACTIONS
import * as RepoActions from './Actions';
export {
  RepoActions,
};