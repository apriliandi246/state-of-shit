// Looping all of the state

"use strict";

function createStore(mainState, mutations) {
  if (typeof mainState !== "object") {
    throw new Error("Just using plain object for the main state");
  }

  if (isJustObject(mainState) === false) {
    throw new Error("Just using plain object for the main state");
  }

  if (typeof mutations !== "function") {
    throw new Error("Just using plain function for the mutations");
  }

  const listeners = [];
  const stateListeners = [];
  const currentSubscribeState = [];

  let isMutating = false;

  function mutate(action) {
    if (isJustObject(action) === false) {
      throw new Error("Just using plain object for the action");
    }

    if (isMutating === true) {
      throw new Error("Reducer is still executing");
    }

    const nextState = mutations({ ...mainState }, action);
    const { isStateChange, currentStatesChange } = shallowComparison(mainState, nextState);

    if (isStateChange === true) {
      mainState = nextState;

      if (listeners.length > 0) {
        for (let index = 0; index < listeners.length; index++) {
          listeners[index]();
        }
      }

      if (stateListeners.length > 0 && currentStatesChange.length !== 0) {
        for (let index = 0; index < currentStatesChange.length; index++) {
          const stateName = currentStatesChange[index];
          const listenerIndex = stateListeners.findIndex((row) => row.indexOf(stateName) !== -1);

          if (listenerIndex !== -1) {
            stateListeners[listenerIndex][1]({ [stateName]: mainState[stateName] });
          }
        }
      }
    }
  }

  function subscribeAll(listener) {
    if (typeof listener !== "function") {
      throw new Error("Just using plain function for subscribe listener");
    }

    listeners.push(listener);

    return function unsubscribe() {
      const listenerIndex = listeners.indexOf(listener);

      if (listenerIndex !== -1 && listener === listeners[listenerIndex]) {
        listeners.splice(listenerIndex, 1);
      }
    };
  }

  function subscribeState(stateName, listener) {
    if (typeof stateName !== "string") {
      throw new Error("Just using string data type for the state property identifier");
    }

    if (mainState.hasOwnProperty(stateName) === false) {
      throw new Error(`There is no "${stateName}" property in your main state`);
    }

    if (typeof listener !== "function") {
      throw new Error("Just using plain function for the subscribe state listener");
    }

    const stateNameExist = stateListeners.findIndex((row) => row.indexOf(stateName) !== -1);

    if (stateNameExist === -1) {
      currentSubscribeState.push(stateName);
      stateListeners.push([stateName, listener]);
    }

    return function unsubscribe() {
      const listenerIndex = stateListeners.findIndex((row) => row.indexOf(listener) !== -1);
      stateListeners.splice(listenerIndex, 1);
    };
  }

  function getState() {
    if (isMutating === true) {
      throw new Error("Reducer is still executing");
    }

    return Object.freeze(mainState);
  }

  function isJustObject(obj) {
    const proto = Object.getPrototypeOf(obj);
    const isPlainObject = proto !== null && Object.getPrototypeOf(proto) === null;

    return isPlainObject;
  }

  function shallowComparison(prevState, nextState) {
    const propertiesNewState = Object.keys(nextState);
    const propertiesPrevState = Object.keys(prevState);
    const comparisonResult = { isStateChange: false, currentStatesChange: [] };

    for (let index = 0; index < propertiesPrevState.length; index++) {
      if (
        prevState.hasOwnProperty(propertiesNewState[index]) === false ||
        nextState[propertiesNewState[index]] !== prevState[propertiesPrevState[index]]
      ) {
        comparisonResult.isStateChange = true;

        if (currentSubscribeState.includes(propertiesPrevState[index])) {
          comparisonResult.currentStatesChange.push(propertiesPrevState[index]);
        }
      }
    }

    return comparisonResult;
  }

  return {
    mutate,
    getState,
    subscribeAll,
    subscribeState,
  };
}
