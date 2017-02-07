import Compile from './Compile.js'
import Watcher from './Watcher.js'
import { observe } from './Observer.js'

class Minivue {
	constructor(opts) {
		this.$options = opts
		let data = this._data = this.$options.data

		// 数据代理
   		// 实现 vm.xxx -> vm._data.xxx
		Object.keys(data).forEach(key => {
			this._proxy(key)
		})

		observe(data, this)

		this.compile = new Compile(opts.el || document.body, this)
	}

	$watch(key, cb, opts) {
		new Watcher(this, key, cb)
	}

    // 遍历 data 的 key，把 data 上的属性代理到 vm 实例上
	_proxy(key) {
		Object.defineProperty(this, key, {
			enumerable: true,
			configurable: true,
			get: () => this._data[key],
			set: newVal => {
				console.log(newVal)
				this._data[key] = newVal
			}
		})
	}
}

window.Minivue = Minivue
export default Minivue