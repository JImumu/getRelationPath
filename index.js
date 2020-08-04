const nodes = require('./nodes.json')
const links = require('./links.json')

/**
* 获取所有路径
* @param fromValue 开始节点属性值
* @param toValue 目标节点属性值
* @param key {String} 对比的属性名
* @param nodes {Array} 所有节点
* @param links {Array} 所有关系
* @retrun {Object} 所有关系路径及所有关系路径上的节点
* @example getPaths('xxx', 'xxxx', 'name', nodes, links)
*/
const getPaths = (fromValue, toValue, key, nodes, links) => {
    if (fromValue === toValue) {
        throw new Error('开始节点与结束节点属性相同')
    }
    const disabledNodes = [] // 无法抵达的点及正在当前路径上的点
    const allPathWidthNodes = [] // 路径节点
    const allPath = [] // 路径

    const from = nodes.find(e => e[key] === fromValue) // 根据value及key找到开始节点
    const to = nodes.find(e => e[key] === toValue) // 根据value及key找到结束节点

    const goArrive = (from, to, nodeArr = [], linkArr = []) => { // 寻路函数
        if (!from) return undefined
        // let obj = {node: from, path: []} // 树型结构

        let isArrivable = false // 是否能够到达终点，默认为false

        disabledNodes.push(from.id) // 记录当前路径上的点
        nodeArr.push(from) // 当前路径上的点

        const relativeArr = links.filter(e => e.source === from.id || e.target === from.id) // 与开始节点关联的所有关系线

        // 寻找与开始节点有关的节点里是否有目标节点
        const res = relativeArr.find(e => {
            if (e.target === to.id || e.source === to.id) {
                linkArr.push(e) // 有则记录路径
                return true
            }
        })

        if (res) { // 如果找到则表示为最优路径，无需继续查找
            // obj.path.push({node: to, path: []}) // 树型结构
            nodeArr.push(to) // 放入目标节点
            allPathWidthNodes.push(nodeArr) // 记录当前成功路径上的所有节点
            allPath.push(linkArr) // 记录当前成功路径上的所有路径
            isArrivable = true
        } else {
          // 如果开始节点相关的节点中未包含目标节点，则遍历与开始节点有关系的节点，以每一项作为from调用goArrive
            for (let i = 0; i < relativeArr.length; i++) {
                const node = nodes.find(e => (e.id === relativeArr[i].target || e.id === relativeArr[i].source) && (!disabledNodes.includes(e.id)))
                linkArr.push(relativeArr[i])
                isArrivable = goArrive(node, to, [...nodeArr], [...linkArr])
                // if (a && temp.path.length >= 1) { // 树型结构
                //     obj.path.push(temp)
                //     disabledNodes.length >= disabledNodes.splice(disabledNodes.length - 1)
                // }
                if (isArrivable) {
                    disabledNodes.splice(disabledNodes.length - 1)
                }
                linkArr.splice(linkArr.length - 1)
            }
        }
        // return obj // 树型结构
        return isArrivable
    }

    goArrive(from, to)

    allPathWidthNodes.sort((a, b) => a.length - b.length) // 按节点数升序，第一项为最优路径
    allPath.sort((a, b) => a.length - b.length) // 按节点数升序，第一项为最优路径

    return {
        allPath: allPath,
        allPathWidthNodes: allPathWidthNodes
    }
}

const from = nodes[parseInt(Math.random() * nodes.length)]
const to = nodes[parseInt(Math.random() * nodes.length)]

const allPath = getPaths(from.name, to.name, 'name', nodes, links)
console.log(allPath)
