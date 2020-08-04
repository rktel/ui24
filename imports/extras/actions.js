export function longpress(node, threshold = 500) {
	const handle_mousedown = () => {
		let start = Date.now();
		
		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'));
		}, threshold);
		
		const cancel = () => {
			clearTimeout(timeout);
			node.removeEventListener('mousemove', cancel);
			node.removeEventListener('mouseup', cancel);
		};
		
		node.addEventListener('mousemove', cancel);
		node.addEventListener('mouseup', cancel);
	}
	
	node.addEventListener('mousedown', handle_mousedown);
	
	return {
		destroy() {
			node.removeEventListener('mousedown', handle_mousedown);
		}
	};
}


export function longtouch(node, threshold = 500) {
	const handle_touchdown = () => {
		let start = Date.now();
		
		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longtouch'));
		}, threshold);
		
		const cancel = () => {
			clearTimeout(timeout);
			node.removeEventListener('touchmove', cancel);
			node.removeEventListener('touchend', cancel);
		};
		
		node.addEventListener('touchmove', cancel);
		node.addEventListener('touchend', cancel);
	}
	
	node.addEventListener('touchstart', handle_touchdown);
	
	return {
		destroy() {
			node.removeEventListener('touchstart', handle_touchdown);
		}
	};
}