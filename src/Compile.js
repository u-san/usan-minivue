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
		this.compileNode(this.fragment)
	}

	compile(node) {
		let nodeAttrs = node.attributes;

		[].slice.call(nodeAttrs).forEach(a => {
			let attrName = a.attrName

			if (!this.isDirective(attrName)) return true;

			let val  = a.value,
				dire = attrName.substring(2)

			if (this.isEventDirective(dire)) {
				utils.eventHandler(node, this.vm, exp, dire)
			}
			else {
				utils[dire] && utils[dire](node, this.vm, exp)
			}

			node.removeAttribute(attrName)
		})
	}

	compileNode(node) {
		let childNodes = node.childNodes;

		[].slice.call(childNodes).forEach(n => {
			let text = n.textContent,
				reg  = /\{\{(.*)\}\}/;

			switch(n.nodeType) {
				case 1:
					this.compile(n)
					break
				case 3:
					if (!reg.test(text)) return
					this.compileText(n, RegExp.$1)
					break
				default:
					break
			}

			if (n.childNodes && n.childNodes.length) {
				this.compileNode(n)
			}
		})
	}

	compileText(node, exp) {
		utils.text(node, this.vm, exp)
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

		while(node.firseChild) {
			frag.appendChild(node.firseChild)
		}

		return frag
	}
}

const utils = {
	text(node, vm, exp) {
		this.bind(node, vm, exp, 'text')
	},

	html(node, vm, exp) {
		this.bind(node, vm, exp, 'html')
	},

	class(node, vm, exp) {
		this.bind(node, vm, exp, 'class')
	},

	model(node, vm, exp) {
		this.bind(node, vm, exp, 'model')

		let val = this.getVMVal(vm, exp)

		node.addEventListener('input', e => {
			let newVal = e.target.value

			if (val === newVal) return

			this.setVMVal(vm, exp, newVal)
			val = newVal
		})
	},

	bind(node, vm, exp, dire) {
		let updaterFunc = update[dire]

		updaterFunc && updaterFunc(node, this.getVMVal(vm, exp))

		new Watcher(vm, exp, (val, oldVal) => {
			updaterFunc && updaterFunc(node, val, oldVal)
		})
	},

	eventHandler(node, vm, exp, dire) {
		let eventType = dire.split(':')[1]
		let fn = vm.$options.methods && vm.$options.methods[exp]

		if (!eventType || !fn) return

		node.addEventListener(eventType, fn.bind(vm), false)
	},

	getVMVal(vm, exp) {
		let val = vm._data
		exp = exp.split('.')
		exp.forEach(k => {
			val = val[k]
		})

		return val
	},

	setVMVal(vm, exp, val) {
		let value = vm._data
		exp = exp.split('.')
		exp.forEach((k, i) => {
			if (i < exp.length - 1) {
				value = value[k]
			}
			else {
				value[k] = val
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
		let cls   = node.className.replce(oldVal, '').trim()
		let space = cls && String(val) ? ' ' : ''

		node.className = cls + space + val 
	},

	model(node, val, oldVal) {
		node.val = typeof val === 'undefined' ? '' : val
	}
}

