import { createStore } from './third-party/state-manager';
import getInitialState from './getInitialState';

export const { useGlobalState, getStates, updateStates, createPropUpdater } =
  createStore(getInitialState());

export const { updateUser, updateHome } = {
  updateUser: createPropUpdater('user'),
  updateHome: createPropUpdater('home'),
};

// for debugging purpose
Object.defineProperty(window, 'globalStates', {
  get: getStates,
  set() {},
});
