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


/**
 * Gets repository's url from the server.
 * @param repoName Repo's name to get url of
 * @returns Repository URL
 */
export const getRepositoryLink = async(repoName:string): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios.get(`${serverIP}/repo/${repoName}`)
      .then(res => res.data.data)
      .then(data => data.link ? resolve(data.link) : reject(new Error('Link not found')))
      .catch(err => reject(err.response.data.error));
  });
};

/**
 * Gets specific repository from Server
 * @param repoName Repo's name to get
 * @returns Repository URL
 */
export const getRepository = async(repoName:string): Promise<IRepository> => {
  return new Promise((resolve, reject) => {
    axios.get(`${serverIP}/repo/${repoName}`)
      .then(res => res.data.data)
      .then(data => (data && data.repo) ? resolve(data.repo) : reject(new Error('Repository not found')))
      .catch(err => reject(err.response.data.error));
  });
};

/**
 * Updates existing repo with new data
 * @param repoName Name of the old Repo
 * @param newRepo New Repo data to update
 * @param listState Current Repo Store list
 * @param dispatch Reducer Root Store Dispatcher
 */
 export const updateRepository = async (repoName: string, newRepo: IRepository, listState: IRepository[], dispatch: RootDispatch) => {
  // Create new Repository List
  const newList = listState
    .map(repo => repo.title.toLowerCase() === repoName.toLowerCase() ? newRepo : repo);

  // Dispatch new list
  dispatch({ payload: newList, type: 'SET_REPO_LIST' });
};