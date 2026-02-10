class Particle {
	constructor(canvas, x, y) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.x = x || Math.random() * canvas.width;
		this.y = y || Math.random() * canvas.height;
		this.size = Math.random() * 5 + 1;
		this.speedX = Math.random() * 3 - 1.5;
		this.speedY = Math.random() * 3 - 1.5;
		this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
	}

	update() {
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1;
		if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1;
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		this.ctx.fill();
	}
}

const initVisuals = (elementId) => {
	const canvas = document.getElementById(elementId);
	const ctx = canvas.getContext("2d");
	const particles = [];

	for (let i = 0; i < 100; i++) {
		particles.push(new Particle(canvas));
	}

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particles.forEach((p) => {
			p.update();
			p.draw();
		});
		requestAnimationFrame(animate);
	}
	animate();
};
