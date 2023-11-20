const store = require("../store/index");

const mainState = {
	sum: 0,
	userID: null
};

function stateModifier(state, payload) {
	const { type, values } = payload;

	if (type === "SET-SUM") {
		state.sum = values.sum;
	}

	if (type === "SET-USER-ID") {
		state.userID = values.userID;
	}

	return state;
}

describe("subscribe", () => {
	test("Check the latest state value from subscribers", () => {
		const { getState, setState, subscribe } = store(mainState, stateModifier);

		subscribe(() => {
			expect(getState().sum).toBe(246);
		});

		setState({
			type: "SET-SUM",
			values: {
				sum: 246
			}
		});
	});

	test("Using more than one subscribers", () => {
		const { getState, setState, subscribe } = store(mainState, stateModifier);

		subscribe(() => {
			expect(getState().userID).toBe(642);
		});

		subscribe(() => {
			expect(getState().userID).toBe(642);
		});

		setState({
			type: "SET-USER-ID",
			values: {
				userID: 642
			}
		});
	});

	test("Throw an error if the subscriber listener parameter is not a function", () => {
		const { subscribe } = store(mainState, stateModifier);

		expect(() => subscribe(24)).toThrow();
	});
});

describe("unsubscribe", () => {
	test("Test unsubscribe state", () => {
		let subscribeCount = 0;
		const { setState, subscribe } = store(mainState, stateModifier);

		const unsubscribe = subscribe(() => {
			subscribeCount += 1;
		});

		unsubscribe();

		subscribe(() => {
			subscribeCount += 1;
		});

		subscribe(() => {
			subscribeCount += 1;
		});

		setState({
			type: "SET-USER-ID",
			values: {
				userID: 241
			}
		});

		expect(subscribeCount).toBe(2);
	});
});
