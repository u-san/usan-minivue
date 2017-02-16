import Watcher from './Watcher'

export default class Compile {

	constructor(node, vm) {
		this.vm = vm
		this.node = this.isElementNode(node) ? node : document.querySelector(node)

		if (this.node) {
			this.fragment = this.toFragment(this.node)
			this.init()
			this.node.appendChild(this.fragment)
		}
	}

	init() {
		this.compile(this.fragment)
	}


	compile(node) {
		let childNodes = node.childNodes;

		[...childNodes].forEach(n => {
			let text = n.textContent,
				reg  = /\{\{(.*)\}\}/;

			switch(n.nodeType) {
				case 1:
					this.compileNode(n)
					break
				case 3:
					if (!reg.test(text)) return
					this.compileText(n, RegExp.$1)
					break
				default:
					break
			}

			if (n.childNodes && n.childNodes.length) {
				this.compile(n)
			}
		})
	}

	compileNode(node) {
		let nodeAttrs = node.attributes;

		[...nodeAttrs].forEach(a => {
			let attrName = a.name

			if (!this.isDirective(attrName)) return true;

			let val  = a.value,
				dire = attrName.substring(2)

			if (this.isEventDirective(dire)) {
				utils.eventHandler(node, this.vm, val, dire)
			}
			else {
				utils[dire] && utils[dire](node, this.vm, val)
			}

			node.removeAttribute(attrName)
		})
	}

	compileText(node, key) {
		utils.text(node, this.vm, key)
	}

	isDirective(str) {
		return str.indexOf('v-') === 0
	}

	isEventDirective(str) {
		return str.indexOf('on') === 0
	}

	isElementNode(node) {
        return node.nodeType === 1;
    }

    isTextNode(node) {
        return node.nodeType === 3;
    }

	toFragment(node) {
		let frag = document.createDocumentFragment()

		while(node.firstChild) {
			frag.appendChild(node.firstChild)
		}

		return frag
	}
}

const utils = {
	text(node, vm, key) {
		this.bind(node, vm, key, 'text')
	},

	html(node, vm, key) {
		this.bind(node, vm, key, 'html')
	},

	class(node, vm, key) {
		this.bind(node, vm, key, 'class')
	},

	model(node, vm, key) {
		this.bind(node, vm, key, 'model')

		let val = this.getVMVal(vm, key)

		node.addEventListener('input', e => {
			let newVal = e.target.value

			if (val === newVal) return

			this.setVMVal(vm, key, newVal)
			val = newVal
		}, false)
	},

	bind(node, vm, key, dire) {
		let updaterFunc = updater[dire]

		updaterFunc && updaterFunc(node, this.getVMVal(vm, key))

		new Watcher(vm, key, (val, oldVal) => {
			updaterFunc && updaterFunc(node, val, oldVal)
		})
	},

	eventHandler(node, vm, key, dire) {
		let eventType = dire.split(':')[1]
		let fn = vm.$options.methods && vm.$options.methods[key]

		if (!eventType || !fn) return

		node.addEventListener(eventType, fn.bind(vm), false)
	},

	getVMVal(vm, key) {
		let data = vm._data
		key = key.split('.')
		key.forEach(k => {
			data = data[k]
		})

		return data
	},

	setVMVal(vm, key, val) {
		let data = vm._data
		key = key.split('.')
		key.forEach((k, i) => {
			if (i < key.length - 1) {
				data = data[k]
			}
			else {
				data[k] = val
			}
		})
	}
}

const updater = {
	text(node, val) {
		node.textContent = typeof val === 'undefined' ? '' : val
	},

	html(node, val) {
		node.innerHTML = typeof val === 'undefined' ? '' : val
	},

	class(node, val, oldVal) {
		let cls   = node.className.replace(oldVal, '').trim()
		let space = cls && String(val) ? ' ' : ''

		node.className = cls + space + val 
	},

	model(node, val) {
		node.value = typeof val === 'undefined' ? '' : val
	}
}

