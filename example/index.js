const store = require("../store/index");

const mainState = {
	name: ""
};

function stateModifier(state, payload) {
	const { type, values } = payload;

	if (type === "UPDATE-NAME") {
		state.name = values.name;
	}

	return state;
}

const { setState, getState, subscribe } = store(mainState, stateModifier);

const unsubscribe = subscribe(() => {
	console.log(getState());
});

setState({
	type: "UPDATE-NAME",
	values: {
		name: "han"
	}
});

setState({
	type: "UPDATE-NAME",
	values: {
		name: "han"
	}
});
