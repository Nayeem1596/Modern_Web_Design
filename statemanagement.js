class Store {
	constructor(reducer, initialState = {}) {
		this.reducer = reducer;
		this.state = initialState;
		this.listeners = [];
	}

	getState() {
		return this.state;
	}

	dispatch(action) {
		console.log(`[Action]: ${action.type}`, action.payload || "");
		const prevState = this.state;
		this.state = this.reducer(this.state, action);

		if (prevState !== this.state) {
			this.notify();
		}
	}

	subscribe(listener) {
		this.listeners.push(listener);
		// Return unsubscribe function
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}

	notify() {
		this.listeners.forEach((listener) => listener(this.state));
	}
}

// App Logic (Reducer)
const initialState = { count: 0, theme: "light", user: null };

function appReducer(state, action) {
	switch (action.type) {
		case "INCREMENT":
			return { ...state, count: state.count + 1 };
		case "SET_THEME":
			return { ...state, theme: action.payload };
		case "LOGIN":
			return { ...state, user: action.payload };
		default:
			return state;
	}
}

// Initialize
const myAppStore = new Store(appReducer, initialState);

// UI Update Listener
const unsubscribe = myAppStore.subscribe((state) => {
	console.log("UI Updated with count:", state.count);
});

myAppStore.dispatch({ type: "INCREMENT" });
myAppStore.dispatch({ type: "SET_THEME", payload: "dark" });
