/**
 * Fine-Grained Reactive Signals
 * Implements: createSignal, createEffect, and createMemo
 */

const context = []; // Stack to track active subscribers

function createSignal(value) {
	const subscriptions = new Set();

	const read = () => {
		const observer = context[context.length - 1];
		if (observer) subscriptions.add(observer);
		return value;
	};

	const write = (newValue) => {
		if (value === newValue) return;
		value = newValue;
		// Notify all subscribers
		[...subscriptions].forEach((sub) => sub.execute());
	};

	return [read, write];
}

function createEffect(fn) {
	const effect = {
		execute() {
			context.push(effect);
			try {
				fn();
			} finally {
				context.pop();
			}
		},
	};
	effect.execute();
}

function createMemo(fn) {
	const [signal, setSignal] = createSignal();
	createEffect(() => setSignal(fn()));
	return signal;
}

// Logic Extension: Reactive Array Helper
function createList(initial) {
	const [list, setList] = createSignal(initial);
	return {
		get: list,
		push: (item) => setList([...list(), item]),
		remove: (index) => setList(list().filter((_, i) => i !== index)),
	};
}

// Usage Example
const [count, setCount] = createSignal(0);
const [name, setName] = createSignal("User");

// This effect runs whenever 'count' or 'name' changes
createEffect(() => {
	console.log(`Log: ${name()} clicked ${count()} times.`);
});

// A computed value that only recalculates when dependencies change
const doubleCount = createMemo(() => count() * 2);

createEffect(() => {
	console.log(`Double count is: ${doubleCount()}`);
});

// Triggering updates
setCount(1); // Logs "User clicked 1 times" and "Double count is: 2"
setName("Admin"); // Logs "Admin clicked 1 times"
