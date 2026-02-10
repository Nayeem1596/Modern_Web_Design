class Animator {
	constructor() {
		this.animations = new Map();
		this.isRunning = false;
	}

	add(id, updateFn) {
		this.animations.set(id, {
			update: updateFn,
			startTime: performance.now(),
			isActive: true,
		});
		if (!this.isRunning) this.start();
	}

	remove(id) {
		this.animations.delete(id);
		if (this.animations.size === 0) this.stop();
	}

	start() {
		this.isRunning = true;
		this.loop();
	}

	stop() {
		this.isRunning = false;
	}

	loop() {
		if (!this.isRunning) return;

		const now = performance.now();

		this.animations.forEach((anim, id) => {
			if (anim.isActive) {
				const elapsed = now - anim.startTime;
				anim.update(elapsed);
			}
		});

		requestAnimationFrame(() => this.loop());
	}

	// Advanced: Easing Helpers
	static easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	static animateElement(el, duration, property, start, end) {
		const animator = new Animator();
		animator.add("move", (elapsed) => {
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = Animator.easeInOutQuad(progress);
			const value = start + (end - start) * easedProgress;

			el.style[property] = `${value}px`;

			if (progress === 1) animator.remove("move");
		});
	}
}

// Usage
// Animator.animateElement(document.getElementById('box'), 1000, 'left', 0, 500);
