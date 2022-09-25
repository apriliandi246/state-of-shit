// Stop looping check if one of state is changed

"use strict";

function createStore(mutations, mainState) {
  if (mutations === undefined) {
    throw new Error("Where is your mutations ?");
  } else {
    if (typeof mutations !== "function") {
      throw new Error("Just using plain function for the mutations");
    }
  }

  if (mainState === undefined) {
    throw new Error("Where is your initial state ?");
  } else {
    if (typeof mainState === "object") {
      if (isJustObject(mainState) === false) {
        throw new Error("Just using plain object for initial state");
      }
    }
  }

  const listeners = [];
  const stateListeners = [];
  const currentSubscribeState = [];

  function mutate(action) {
    if (action === undefined) {
      throw new Error("Where is your action when mutating the state ?");
    }

    const nextState = mutations({ ...mainState }, action);
    const { isStateChange, currentStateChange } = shallowComparison(mainState, nextState);

    if (isStateChange === true) {
      mainState = nextState;

      if (listeners.length > 0) {
        for (let index = 0; index < listeners.length; index++) {
          listeners[index]();
        }
      }

      if (stateListeners.length > 0) {
        const listenerIndex = stateListeners.findIndex(
          (row) => row.indexOf(currentStateChange) !== -1
        );

        if (listenerIndex !== -1) {
          stateListeners[listenerIndex][1]({ [currentStateChange]: mainState[currentStateChange] });
        }
      }
    }
  }

  function subscribe(listener) {
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

    const stateNameIndex = stateListeners.findIndex((row) => row.indexOf(stateName) !== -1);

    if (stateNameIndex !== -1) {
      throw new Error(`"${stateName}" already registered before in subscribeState`);
    }

    currentSubscribeState.push(stateName);
    stateListeners.push([stateName, listener]);

    return function unsubscribe() {
      const listenerIndex = stateListeners.findIndex((row) => row.indexOf(listener) !== -1);
      stateListeners.splice(listenerIndex, 1);
    };
  }

  function getState() {
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
    const comparisonResult = { isStateChange: false, currentStateChange: undefined };

    for (let index = 0; index < propertiesPrevState.length; index++) {
      if (
        prevState.hasOwnProperty(propertiesNewState[index]) === false ||
        nextState[propertiesNewState[index]] !== prevState[propertiesPrevState[index]]
      ) {
        comparisonResult.isStateChange = true;

        if (currentSubscribeState.includes(propertiesPrevState[index])) {
          comparisonResult.currentStateChange = propertiesPrevState[index];

          return comparisonResult;
        }

        return comparisonResult;
      }
    }

    return comparisonResult;
  }

  return {
    mutate,
    getState,
    subscribe,
    subscribeState,
  };
}
