
export default class Watcher {
	constructor(vm, exp, cb) {
		this.cb = cb
		this.vm = vm
		this.exp = exp
		this.depIds = {}
		this.value = this.get()
	}

	get() {
		
	}
}