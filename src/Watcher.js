import Dep from './Dep.js'

export default class Watcher {
	constructor(vm, key, cb) {
		this.cb = cb
		this.vm = vm
		this.key = key  //someStr
		this.depIds = {}
		this.value = this.get()
	}

	update() {
		this.run()
	}

    addDep(dep) {
        
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
        let key = this.key.split('.')
        let data = this.vm._data
        key.forEach(function(k) {
            data = data[k];
        })
        return data;
    }
}
