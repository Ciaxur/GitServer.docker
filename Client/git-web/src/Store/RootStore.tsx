import React from 'react';

export interface IRootStore {
  routePath:      string,
  setRoutePath:   (newRoute: string) => void,
}

export interface IRootStoreAction {
  type: 'SET_ROUTE',
  payload: any,
}

export const RootStoreReducer = (state: IRootStore, action: IRootStoreAction) => {
  const { payload, type } = action;

  switch (type) {
    case 'SET_ROUTE':
      return {
        ...state,
        routePath: payload,
      };
    default:
      return state;
  }
};

export const RootStoreContext = React.createContext<IRootStore>({
  routePath: '/',
  setRoutePath: () => { return; },
});