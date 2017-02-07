import Dep from './Dep.js'

class Observer {
    constructor(data) {
        this.data = data
        this.walk(data)
    }

    walk(data) {
        Object.keys(data).forEach(key => {
            console.log(key)
            this.convert(key, data[key])
        })
    }

    convert(key, val) {
        this.defineReactive(this.data, key, val)
    }
    
    // 把要观察的 data 对象的每个属性都赋予 getter 和 setter 方法, 以追踪变化
    // 当 data 的某个属性被访问时，则会调用 getter 方法，
    // 判断当 Dep.target 不为空时调用 dep.depend 和 childObj.dep.depend 方法做依赖收集。
    // 如果访问的属性是一个数组，则会遍历这个数组收集数组元素的依赖。
    // 当改变 data 的属性时，则会调用 setter 方法, 这时调用 dep.notify 方法进行通知

    defineReactive(data, key, val) {
        let dep = new Dep()
        let childObj = observe(val)

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                console.log(Dep.target)
                if (Dep.target) {
                    dep.depend()
                }

                return val
            },
            set: newVal => {
                console.log(newVal)

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


export const observe = (data, vm) => {
    if (!data || typeof data !== 'object') return

    return new Observer(data)
}
