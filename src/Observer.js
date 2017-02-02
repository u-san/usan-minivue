import Dep from './Dep.js'

export default class Observer {
    constructor(data) {
        this.data = data
        this.walk(data)
    }

    walk(data) {
        Object.keys(data).forEach(key => {
            this.convert(key, data[key])
        })
    }

    convert(key, val) {
        this.defineReactive(this.data, key, val)
    }

    defineReactive(data, key, val) {
        let dep = new Dep()
        let childObj = observe(val)

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: () => {
                if (Dep.target) {
                    dep.depend()
                }

                return val
            },
            set: newVal => {
                if (newVal === val) return

                val = newVal

                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                dep.notify();

            }
        })

    }
}


const observe = (val, vm) => {
    if (!val || typeof val !== 'object') return

    return new Observer(val)
}
