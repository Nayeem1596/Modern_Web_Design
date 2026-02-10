/**
 * Simple Virtual DOM Engine
 * Implements: h (hyperscript), render, and basic diffing
 */

// 1. Create a virtual node (VNode)
const h = (type, props, ...children) => ({
	type,
	props: props || {},
	children: children.flat().filter((c) => c != null && c !== false),
});

// 2. Transform VNode into a real DOM node
const createElement = (vnode) => {
	if (typeof vnode === "string" || typeof vnode === "number") {
		return document.createTextNode(vnode);
	}

	const $el = document.createElement(vnode.type);

	// Set attributes
	Object.entries(vnode.props || {}).forEach(([name, value]) => {
		if (name.startsWith("on")) {
			$el.addEventListener(name.toLowerCase().substring(2), value);
		} else {
			$el.setAttribute(name, value);
		}
	});

	// Recursively append children
	vnode.children.forEach((child) => $el.appendChild(createElement(child)));
	return $el;
};

// 3. Diffing Algorithm: Updates the real DOM based on changes
const updateElement = ($parent, newNode, oldNode, index = 0) => {
	const $child = $parent.childNodes[index];

	// Case 1: Node added
	if (!oldNode) {
		$parent.appendChild(createElement(newNode));
	}
	// Case 2: Node removed
	else if (!newNode) {
		$parent.removeChild($child);
	}
	// Case 3: Node changed (different type)
	else if (
		newNode.type !== oldNode.type ||
		typeof newNode !== typeof oldNode
	) {
		$parent.replaceChild(createElement(newNode), $child);
	}
	// Case 4: Same type, diff children
	else if (newNode.type) {
		// Update attributes (simplified)
		Object.entries(newNode.props).forEach(([name, value]) => {
			if (value !== oldNode.props[name]) $child.setAttribute(name, value);
		});

		const newLength = newNode.children.length;
		const oldLength = oldNode.children.length;
		for (let i = 0; i < Math.max(newLength, oldLength); i++) {
			updateElement($child, newNode.children[i], oldNode.children[i], i);
		}
	}
};

// Usage Example
let state = { count: 0 };
const view = (s) =>
	h(
		"div",
		{ class: "container" },
		h("h1", {}, `Count: ${s.count}`),
		h("button", { onclick: () => update(state.count + 1) }, "Increment"),
	);

let currentVNode = view(state);
const $root = document.getElementById("app");
$root.appendChild(createElement(currentVNode));

function update(newCount) {
	state.count = newCount;
	const newVNode = view(state);
	updateElement($root, newVNode, currentVNode);
	currentVNode = newVNode;
}
