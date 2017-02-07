import Dep from './Dep.js'

export default class Watcher {
	constructor(vm, exp, cb) {
        console.log(vm, exp, cb)
		this.cb = cb
		this.vm = vm
		this.exp = exp
		this.depIds = {}
		this.value = this.get()
	}

	update() {
		this.run()
	}

    addDep(dep) {
        // 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，仅仅是改变了其值而已
        // 则不需要将当前watcher添加到该属性的dep里
        // 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
        // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
        // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
        // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中,
        // 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
        // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
        // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
        // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
        // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }

    // 每次调用run()的时候会触发相应属性的getter
    // getter里面会触发dep.depend()，继而触发这里的addDep
	run() {
		let value = this.get()
		let oldVal = this.value

		if (value !== oldVal) {
			this.value = value
			this.cb.call(this.vm, value, oldVal)
		}
	}

	get() {
		Dep.target = this
        let value = this.getVMVal()
        Dep.target = null
        return value
	}

	getVMVal() {
        let exp = this.exp.split('.')
        let val = this.vm._data
        exp.forEach(function(k) {
            val = val[k];
        })
        return val;
    }
}
