import Compile from './Compile.js'
import Watcher from './Watcher.js'
import { observe } from './Observer.js'
console.log(1)
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

	_proxy(key) {
		Object.defineProperty(this, key, {
			configurable: false,
			enumerable: true,
			get: () => this._data[key],
			set: () => {
				this._data[key] = newVal
			}
		})
	}
}

window.Minivue = Minivue
export default Minivue