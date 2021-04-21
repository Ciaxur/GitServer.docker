import React from 'react';
import { IRepository, isRepository, isRepositoryArray } from '../../Components/Repository';

export interface IRootStore {
  store: {
    // Internal State for Routing
    routePath:      string,

    // Repository Store
    repoStore: {
      loaded:     boolean,
      repoList:   IRepository[],
    },
  },
  dispatch: React.Dispatch<IRootStoreAction>,
}

export interface IRootStoreAction {
  type: 'SET_ROUTE' | 'SET_REPO_LIST' | 
        'ADD_REPO' | 'REM_REPO',
  payload: string | IRepository | IRepository[],
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
    },
  },
};

export const RootStoreContext = React.createContext<IRootStore>(RootStoreDefault as IRootStore);

// FORWARD EXPORT ACTIONS
import * as RepoActions from './Actions';
export {
  RepoActions,
};