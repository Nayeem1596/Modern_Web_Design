class EventBus {
	constructor() {
		this.events = {};
	}

	on(event, callback) {
		if (!this.events[event]) this.events[event] = [];
		this.events[event].push(callback);
		return () => this.off(event, callback); // Unsubscribe function
	}

	off(event, callback) {
		if (!this.events[event]) return;
		this.events[event] = this.events[event].filter((cb) => cb !== callback);
	}

	emit(event, data) {
		if (!this.events[event]) return;
		this.events[event].forEach((callback) => callback(data));
	}
}

class DOMWatcher {
	constructor(elementSelector, bus) {
		this.element = document.querySelector(elementSelector);
		this.bus = bus;
		this.observer = null;
	}

	init() {
		if (!this.element) return;

		// Listen for attribute changes
		this.observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes") {
					this.bus.emit("dom:attr_change", {
						attribute: mutation.attributeName,
						target: mutation.target,
					});
				}
			});
		});

		this.observer.observe(this.element, { attributes: true });
		console.log("Watching DOM for changes...");
	}

	stop() {
		if (this.observer) this.observer.disconnect();
	}
}

// Usage
const bus = new EventBus();
const watcher = new DOMWatcher("#app", bus);

bus.on("dom:attr_change", (data) => {
	console.log(`Attribute ${data.attribute} changed!`);
});

watcher.init();
