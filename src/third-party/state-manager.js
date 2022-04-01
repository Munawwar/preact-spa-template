// @ts-nocheck
import { useEffect, useState, useRef } from 'preact/hooks';

/**
 * @template Store
 * @param {Store} initialState
 * @returns {{
 *  getStates(): Store;
 *  updateStates(partial: Partial<Store>): void;
 *  createPropUpdater<Prop extends keyof Store>(propName: Prop): (partial: Partial<Store[Prop]>) => void;
 *  useGlobalState<Prop extends keyof Store>(prop: Prop): Store[Prop],
 * }}
 */
function createStore(initialState = {}) {
  // "The" global store
  let store = initialState;

  // internal publisher-subscriber system to
  // notify containers of store changes.
  const pubsub = {
    handlers: [],
    subscribe(handler) {
      if (!this.handlers.includes(handler)) {
        this.handlers.push(handler);
      }
    },
    unsubscribe(handler) {
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    },
    notify(newStore) {
      this.handlers.forEach((handler) => handler(newStore));
    },
  };

  const getStates = () => ({ ...store });

  const updateStates = (partial) => {
    const newStore = {
      ...store,
      ...partial,
    };
    store = newStore;
    pubsub.notify(newStore);
  };

  const useGlobalState = (propName) => {
    // prevent stale closure in case of multiple updates
    const ref = useRef(store[propName]);
    // but also have a state, so that UI refresh can be triggered
    const [, setState] = useState(store[propName]);

    useEffect(() => {
      const newStateHandler = (newStore) => {
        const newState = newStore[propName];
        if (!isEqual(ref.current, newState)) {
          ref.current = newState;
          setState(newState);
        }
      };
      pubsub.subscribe(newStateHandler);
      // on component unmount, unsubscribe to prevent mem leak
      return () => pubsub.unsubscribe(newStateHandler);
    }, [propName]);

    return ref.current;
  };

  const createPropUpdater = (propName) => (partial) =>
    updateStates({ [propName]: partial });

  return { useGlobalState, getStates, updateStates, createPropUpdater };
}

export { createStore };

function isEqual(a, b) {
  if (a === b) return true;

  if (typeof a != 'object' || typeof b != 'object' || a == null || b == null)
    return false;

  // both should be arrays or both should be objects
  const isArrA = Array.isArray(a);
  const isArrB = Array.isArray(b);
  if (!((isArrA && isArrB) || (!isArrA && !isArrB))) return false;

  if (isArrA) {
    if (a.length != b.length) return false;
  }

  let entriesA = Object.entries(a);

  // for objects undefined values needs to be ignored
  // e.g. { a: undefined } and {} are equal as far as state manager is concerned
  if (!isArrA) {
    const filterUndefined = ([, v]) => v !== undefined;
    entriesA = entriesA.filter(filterUndefined);
    const entriesB = Object.entries(b).filter(filterUndefined);
    if (entriesA.length != entriesB.length) return false;
  }

  for (let [keyA] of entriesA) {
    if (!isEqual(a[keyA], b[keyA])) return false;
  }

  return true;
}
