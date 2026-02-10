class ApiClient {
	constructor(baseUrl = "", defaultHeaders = {}) {
		this.baseUrl = baseUrl;
		this.headers = {
			"Content-Type": "application/json",
			...defaultHeaders,
		};
	}

	async request(endpoint, options = {}) {
		const { method = "GET", body, timeout = 8000, headers = {} } = options;
		const url = `${this.baseUrl}${endpoint}`;

		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				method,
				headers: { ...this.headers, ...headers },
				body: body ? JSON.stringify(body) : null,
				signal: controller.signal,
			});

			clearTimeout(id);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (error.name === "AbortError") {
				console.error("Request timed out");
			}
			throw error;
		}
	}

	get(endpoint, options) {
		return this.request(endpoint, { ...options, method: "GET" });
	}

	post(endpoint, data, options) {
		return this.request(endpoint, {
			...options,
			method: "POST",
			body: data,
		});
	}

	// Advanced: Interceptor Logic
	async getWithRetry(endpoint, retries = 3) {
		for (let i = 0; i < retries; i++) {
			try {
				return await this.get(endpoint);
			} catch (err) {
				if (i === retries - 1) throw err;
				console.warn(`Retry ${i + 1} failed...`);
			}
		}
	}
}

// Usage
const api = new ApiClient("https://jsonplaceholder.typicode.com");
api.get("/posts/1").then(console.log).catch(console.error);
