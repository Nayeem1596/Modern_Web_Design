class TodoApp {
	constructor() {
		this.todos = JSON.parse(localStorage.getItem("myTodos")) || [];
		this.filter = "all";
	}

	addTodo(text) {
		if (!text.trim()) return;
		const newTodo = {
			id: Date.now(),
			text: text.trim(),
			completed: false,
			createdAt: new Date().toISOString(),
		};
		this.todos.push(newTodo);
		this.save();
	}

	toggleTodo(id) {
		this.todos = this.todos.map((todo) =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo,
		);
		this.save();
	}

	deleteTodo(id) {
		this.todos = this.todos.filter((todo) => todo.id !== id);
		this.save();
	}

	setFilter(filterType) {
		const validFilters = ["all", "active", "completed"];
		if (validFilters.includes(filterType)) {
			this.filter = filterType;
		}
	}

	getVisibleTodos() {
		switch (this.filter) {
			case "active":
				return this.todos.filter((t) => !t.completed);
			case "completed":
				return this.todos.filter((t) => t.completed);
			default:
				return this.todos;
		}
	}

	clearCompleted() {
		this.todos = this.todos.filter((t) => !t.completed);
		this.save();
	}

	save() {
		localStorage.setItem("myTodos", JSON.stringify(this.todos));
		console.log("State updated:", this.getVisibleTodos());
	}

	// Additional logic for 100-line depth: Analytics
	getStats() {
		const total = this.todos.length;
		const completed = this.todos.filter((t) => t.completed).length;
		return {
			total,
			completed,
			pending: total - completed,
			percentComplete:
				total === 0 ? 0 : Math.round((completed / total) * 100),
		};
	}
}

// Usage Example
const myApp = new TodoApp();
myApp.addTodo("Learn JS Snippets");
myApp.addTodo("Master DOM Manipulation");
myApp.toggleTodo(myApp.todos[0].id);
console.log(myApp.getStats());
