import React from 'react';
import { IRepository } from '../../Components/Repository';
import { IRootStoreAction } from './';
import axios from 'axios';

// Constant Configurations
const serverIP = process.env.REACT_APP_IP;
type RootDispatch = React.Dispatch<IRootStoreAction>;

// General Response from the Server
interface GeneralResponse {
  message: string,
  debug: any,
}


/**
 * Sets new Route by calling Root Context's Dispatch
 * @param newRoute New Route to set
 * @param dispatch Reducer Root Store Dispatcher
 */
export const setRoutePath = async (newRoute: string, dispatch: RootDispatch) => {
  dispatch({ payload: newRoute, type: 'SET_ROUTE' });
};

/**
 * Sets entire Repository List
 * @param newList New Repo List to set
 * @param dispatch Reducer Root Store Dispatcher
 */
export const setRepoList = async (newList: IRepository[], dispatch: RootDispatch) => {
  // Clean then dispatch
  dispatch({ payload: newList.map(elt => ({
    ...elt,
    createdAt: new Date(elt.createdAt),
    updatedAt: new Date(elt.updatedAt),
  })), type: 'SET_REPO_LIST' });
};

/**
 * Removes given Repository from DB and Root Store
 * @param repoName Repo's name to remove
 * @param dispatch Reducer Root Store Dispatcher
 * @returns Repository Removed
 */
export const removeRepository = async (repoName: string, dispatch: RootDispatch): Promise<GeneralResponse> => {
  return new Promise((resolve, reject) => {
    axios.delete(`${serverIP}/repo/${repoName}`)
      .then(res => {
        if (res.status === 200) {
          dispatch({ payload: repoName, type: 'REM_REPO' });
          resolve(res.data);
        }else {
          reject(new Error(res.data.message || res.data.error));
        }
      })
      .catch(err => reject(err));
  });
};
