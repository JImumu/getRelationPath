const nodes = require('./nodes.json')
const links = require('./links.json')

getPaths = (fromValue, toValue, key, nodes, links) => {
    let disabledNodes = []
    let allPathWidthNodes = []
    let allPath = []

    let from = nodes.find(e => e[key] === fromValue)
    let to = nodes.find(e => e[key] === toValue)

    goArrive = (from, to, nodeArr = [], linkArr = []) => {
        if (!from) return undefined
        // let obj = {node: from, path: []}
        let isArrivable = false
        disabledNodes.push(from.id)
        nodeArr.push(from)
        let relativeArr = links.filter(e => e.source === from.id || e.target === from.id)
        let res = relativeArr.find(e => {
            if (e.target === to.id || e.source === to.id) {
                linkArr.push(e)
                return true
            }
        })
        if (res) {
            // obj.path.push({node: to, path: []})
            nodeArr.push(to)
            allPathWidthNodes.push(nodeArr)
            allPath.push(linkArr)
            isArrivable = true
        } else {
            for (let i = 0; i < relativeArr.length; i++) {
                let a = nodes.find(e => (e.id === relativeArr[i].target || e.id === relativeArr[i].source) && (!disabledNodes.includes(e.id)))
                linkArr.push(relativeArr[i])
                isArrivable = goArrive(a, to, [...nodeArr], [...linkArr])
                // if (a && temp.path.length >= 1) {
                //     obj.path.push(temp)
                //     disabledNodes.length >= disabledNodes.splice(disabledNodes.length - 1)
                // }
                if (isArrivable) {
                    disabledNodes.splice(disabledNodes.length - 1)
                }
                linkArr.splice(linkArr.length - 1)
            }
        }
        // return obj
        return isArrivable
    }
    goArrive(from, to)
    allPathWidthNodes.sort((a, b) => a.length - b.length)
    allPath.sort((a, b) => a.length - b.length)
    return {
        allPath: allPath,
        allPathWidthNodes: allPathWidthNodes
    }
}

const from = nodes[parseInt(Math.random() * nodes.length)]
const to   = nodes[parseInt(Math.random() * nodes.length)]

const allPath = getPaths(from.name, to.name, 'name', nodes, links)
console.log(allPath)