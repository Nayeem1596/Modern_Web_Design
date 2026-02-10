class TaskScheduler {
	constructor(concurrencyLimit = 3) {
		this.concurrencyLimit = concurrencyLimit;
		this.runningTasks = 0;
		this.queue = [];
		this.history = [];
	}

	// Adds a task with a specific priority (higher number = higher priority)
	addTask(taskFn, priority = 0, name = "Unnamed Task") {
		return new Promise((resolve, reject) => {
			this.queue.push({ taskFn, priority, name, resolve, reject });
			this.queue.sort((a, b) => b.priority - a.priority);
			this.processQueue();
		});
	}

	async processQueue() {
		if (
			this.runningTasks >= this.concurrencyLimit ||
			this.queue.length === 0
		) {
			return;
		}

		const { taskFn, name, resolve, reject } = this.queue.shift();
		this.runningTasks++;
		console.log(`[Scheduler] Starting: ${name}`);

		try {
			const result = await taskFn();
			this.history.push({ name, status: "completed", time: new Date() });
			resolve(result);
		} catch (error) {
			this.history.push({
				name,
				status: "failed",
				error: error.message,
				time: new Date(),
			});
			reject(error);
		} finally {
			this.runningTasks--;
			this.processQueue();
		}
	}

	getStats() {
		return {
			pending: this.queue.length,
			active: this.runningTasks,
			completed: this.history.length,
		};
	}

	clearQueue() {
		this.queue = [];
		console.log("[Scheduler] Queue cleared.");
	}
}

// Usage Example
const scheduler = new TaskScheduler(2);
const dummyTask = (id, ms) => () =>
	new Promise((res) => setTimeout(() => res(`Task ${id} done`), ms));

scheduler.addTask(dummyTask(1, 1000), 1, "Low Priority").then(console.log);
scheduler.addTask(dummyTask(2, 500), 10, "High Priority").then(console.log);
scheduler.addTask(dummyTask(3, 200), 5, "Mid Priority").then(console.log);
