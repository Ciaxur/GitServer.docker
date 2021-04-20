import React from 'react';
import { IRepository } from '../../Components/Repository';
import { IRootStoreAction } from './';

type RootDispatch = React.Dispatch<IRootStoreAction>;

/**
 * Sets new Route by calling Root Context's Dispatch
 * @param newRoute New Route to set
 * @param dispatch Reducer Root Store Dispatcher
 */
export const setRoutePath = async(newRoute: string, dispatch: RootDispatch) => {
  dispatch({ payload: newRoute, type: 'SET_ROUTE' });
};


/**
 * Sets entire Repository List
 * @param newList New Repo List to set
 * @param dispatch Reducer Root Store Dispatcher
 */
export const setRepoList = async(newList: IRepository[], dispatch: RootDispatch) => {
  // Clean then dispatch
  dispatch({ payload: newList.map(elt => ({
    ...elt,
    createdAt: new Date(elt.createdAt),
    updatedAt: new Date(elt.updatedAt),
  })), type: 'SET_REPO_LIST' });
};
