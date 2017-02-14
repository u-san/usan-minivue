let uid = 0

// 依赖
class Dep {
    constructor() {
        this.id   = uid++
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    depend() {
        // Dep.target 表示当前正在计算的 Watcher，它是全局唯一的
        // 因为在同一时间只能有一个 Watcher 被计算
        Dep.target.addDep(this)
    }

    removeSub(sub) {
        let index = this.subs.indexOf(sub)
        index !== -1 && this.subs.splice(index, 1)
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

Dep.target = null

export default Dep