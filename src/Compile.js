
class Compile {
	contructor(node, vm) {
		this.vm = vm
		this.node = this.isEleNode(node) ? node : document.querySelector(node)

		if (this.node) {
			this.fragment = this.toFragment(this.node)
			this.init()
			this.node.appendChild(this.fragment)
		}
	}

	static isDirective(str) {
		return str.indexOf('v-') === 0
	}

	static isEventDirective(str) {
		return str.indexOf('on') === 0
	}

	static toFragment(node) {
		let frag = document.createDocumentFragment()

		while(node.firseChild) {
			frag.appendChild(node.firseChild)
		}

		return frag
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

			}
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
}

export default Compile

