class FileUploader {
	constructor(dropZoneId, options = {}) {
		this.dropZone = document.getElementById(dropZoneId);
		this.options = {
			maxSize: 5 * 1024 * 1024, // 5MB
			allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
			...options,
		};
		this.init();
	}

	init() {
		["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => {
			this.dropZone.addEventListener(
				evt,
				(e) => {
					e.preventDefault();
					e.stopPropagation();
				},
				false,
			);
		});

		this.dropZone.addEventListener("drop", (e) => this.handleDrop(e));
		this.dropZone.addEventListener("dragover", () =>
			this.dropZone.classList.add("highlight"),
		);
		this.dropZone.addEventListener("dragleave", () =>
			this.dropZone.classList.remove("highlight"),
		);
	}

	handleDrop(e) {
		this.dropZone.classList.remove("highlight");
		const files = Array.from(e.dataTransfer.files);
		files.forEach((file) => this.validateAndProcess(file));
	}

	validateAndProcess(file) {
		if (!this.options.allowedTypes.includes(file.type)) {
			alert(`Invalid format: ${file.name}`);
			return;
		}
		if (file.size > this.options.maxSize) {
			alert(`File too large: ${file.name}`);
			return;
		}
		this.previewFile(file);
	}

	previewFile(file) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			const img = document.createElement("img");
			img.src = reader.result;
			img.style.width = "100px";
			document.body.appendChild(img);
		};
	}
}
