"use strict";

function store(mainState, modifier) {
	if (isJustObject(mainState) === false) {
		throw new Error("Just using plain object for the main state");
	}

	if (isObjectEmpty(mainState) === true) {
		throw new Error("Where the hell is your properties of state in your main state object");
	}

	if (typeof modifier !== "function") {
		throw new Error("Just using plain function for the state modifier");
	}

	let isMutating = false;
	const subscribersQueue = [];

	function getState() {
		/*
			🕵️‍♂️
		*/
		if (isMutating === true) return;

		return Object.freeze(mainState);
	}

	function setState(payload) {
		/*
			🕵️‍♂️
		*/
		if (isMutating === true) return;

		if (isJustObject(payload) === false) {
			throw new Error("Just using plain object for the payload");
		}

		const nextState = modifier({ ...mainState }, payload);

		if (isJustObject(nextState) === false) {
			throw new Error("Where is the return of object state from your state modifier?");
		}

		mainState = nextState;

		if (subscribersQueue.length > 0) {
			for (let listenerIdx = 0; listenerIdx < subscribersQueue.length; listenerIdx++) {
				const subscribeListener = subscribersQueue[listenerIdx];
				subscribeListener();
			}
		}
	}

	function subscribe(subscriber) {
		if (typeof subscriber !== "function") {
			throw new Error("Just using plain function for the subscribe listener");
		}

		subscribersQueue.push(subscriber);

		return function unsubscribe() {
			const subscribeListenerIndex = subscribersQueue.indexOf(subscriber);

			if (subscribeListenerIndex !== -1 && subscriber === subscribersQueue[subscribeListenerIndex]) {
				subscribersQueue.splice(subscribeListenerIndex, 1);
			}
		};
	}

	function isJustObject(obj) {
		if (typeof obj !== "object") return false;

		const proto = Object.getPrototypeOf(obj);
		const isPlainObject = proto !== null && Object.getPrototypeOf(proto) === null;

		return isPlainObject;
	}

	function isObjectEmpty(obj) {
		const objProperties = Object.keys(obj);

		if (objProperties.length === 0) {
			return true;
		} else {
			return false;
		}
	}

	return {
		setState,
		getState,
		subscribe
	};
}

module.exports = store;
