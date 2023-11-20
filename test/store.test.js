const store = require("../store/index");

describe("store", () => {
	test("Throw error if the main state parameter is not a plain object type", () => {
		expect(() => store("test", () => {})).toThrow();
		expect(() => store(24, () => {})).toThrow();
		expect(() => store(true, () => {})).toThrow();
		expect(() => store(undefined, () => {})).toThrow();
		expect(() => store(null, () => {})).toThrow();
		expect(() => store([], () => {})).toThrow();
		expect(() => store(new Set({ name: "han" }), () => {})).toThrow();
	});

	test("Throw error if the main state parameter is a plain object but it's empty", () => {
		expect(() => store({}, () => {})).toThrow();
	});

	test("Throw an error if the modifier state parameter is not a function", () => {
		expect(() => store({ name: "han" }, "test")).toThrow();
		expect(() => store({ name: "han" }, 12)).toThrow();
		expect(() => store({ name: "han" }, true)).toThrow();
		expect(() => store({ name: "han" }, undefined)).toThrow();
		expect(() => store({ name: "han" }, null)).toThrow();
		expect(() => store({ name: "han" }, [])).toThrow();
		expect(() => store({ name: "han" }, {})).toThrow();
	});
});
