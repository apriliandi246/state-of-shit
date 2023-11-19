const store = require("../store/index");

const mainState = {
	sum: 0,
	name: "",
	shoppingList: [],
	isRaining: false,
	address: { street: "", post: 0 }
};

function stateModifier(state, payload) {
	const { type, values } = payload;

	if (type === "SET-SUM") {
		state.sum = values.sum;
	}

	if (type === "SET-NAME") {
		state.name = values.name;
	}

	if (type === "SET-ADDRESS") {
		state.address = values.address;
	}

	if (type === "SET-SHPPING-LIST") {
		const shoppingList = [...state.shoppingList, ...values.items];
		state.shoppingList = shoppingList;
	}

	if (type === "SET-RAINING-STATUS") {
		state.isRaining = values.isRaining;
	}

	return state;
}

describe("getState and setState", () => {
	test("Test number value and check the latest value inside the subscriber", () => {
		const { getState, setState, subscribe } = store(mainState, stateModifier);

		subscribe(() => {
			expect(getState().sum).toBe(24);
		});

		setState({
			type: "SET-SUM",
			values: {
				sum: 24
			}
		});

		expect(getState().sum).toBe(24);
	});

	test("Test string value and check the latest value inside the subscriber", () => {
		const { getState, setState, subscribe } = store(mainState, stateModifier);

		subscribe(() => {
			expect(getState().name).toBe("han");
		});

		setState({
			type: "SET-NAME",
			values: {
				name: "han"
			}
		});

		expect(getState().name).toBe("han");
	});

	test("Test object value and check the latest value inside the subscriber", () => {
		const { getState, setState, subscribe } = store(mainState, stateModifier);

		const payloadAddress = {
			street: "Javascript street",
			post: 2461
		};

		subscribe(() => {
			expect(getState().address).toEqual(payloadAddress);
		});

		setState({
			type: "SET-ADDRESS",
			values: {
				address: payloadAddress
			}
		});

		expect(getState().address).toEqual(payloadAddress);
	});

	test("Test array value and check the latest value inside the subscriber", () => {
		const shoppingList = ["milk", "snack"];
		const { getState, setState, subscribe } = store(mainState, stateModifier);

		subscribe(() => {
			expect(getState().shoppingList).toEqual(shoppingList);
			expect(getState().shoppingList).toHaveLength(shoppingList.length);
		});

		setState({
			type: "SET-SHPPING-LIST",
			values: {
				items: ["milk", "snack"]
			}
		});

		expect(getState().shoppingList).toEqual(shoppingList);
		expect(getState().shoppingList).toHaveLength(shoppingList.length);
	});

	test("Test boolean value", () => {
		const { getState, setState } = store(mainState, stateModifier);

		setState({
			type: "SET-RAINING-STATUS",
			values: {
				isRaining: !getState().isRaining
			}
		});

		expect(getState().isRaining).toBe(true);
		expect(getState().isRaining).toBeTruthy();

		setState({
			type: "SET-RAINING-STATUS",
			values: {
				isRaining: !getState().isRaining
			}
		});

		expect(getState().isRaining).toBe(false);
		expect(getState().isRaining).toBeFalsy();
	});

	test("Throw an error when set the state without using object", () => {
		const { setState } = store(mainState, stateModifier);

		expect(() => setState(24)).toThrow();
	});

	test("Throw an error if the state modifier does not return an object of state", () => {
		function stateModifier(state, payload) {
			const { type, values } = payload;

			if (type === "SET-SUM") {
				state.sum = values.sum;
			}

			if (type === "SET-NAME") {
				state.name = values.name;
			}
		}

		const { setState } = store(mainState, stateModifier);

		const payload = {
			type: "SET-NAME",
			values: {
				name: "han246"
			}
		};

		expect(() => setState(payload)).toThrow();
	});
});
