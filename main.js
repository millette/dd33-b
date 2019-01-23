// taken from https://bl.ocks.org/mbostock/1095795

import d3 from "./d3.js"

const svg = d3.select("svg")
const width = +svg.attr("width")
const height = +svg.attr("height")
const color = d3.scaleOrdinal(d3.schemeCategory10)

/*
const a = { id: "a" }
const b = { id: "b" }
const c = { id: "c" }
const d = { id: "d" }

const nodes = [a, b, c, d]
// const links = []
const links = [
  { source: a, target: b },
  { source: d, target: c }
]
*/

import stuff from "./el-graph-data.json"

const nodes = stuff.nodes // .map((x) => ({...x}))
const links = []
// const links = stuff.links.map(({source, target}) => ({ source: {id: source}, target: {id : target}}))

console.log("NODES", nodes.length)
console.log("LINKS", links.length, links[0])

const simulation = d3
  .forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-150))
  .force("link", d3.forceLink(links).distance(50))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .alphaTarget(1)
  .on("tick", ticked)

const g = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

let link = g
  .append("g")
  .attr("stroke", "#000")
  .attr("stroke-width", 1.5)
  .selectAll(".link")

let node = g
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll(".node")

restart()

d3.timeout(function() {
  // links = stuff.links.map(({source, target}) => ({ source: {id: source}, target: {id : target}}))
  const source = nodes[0]

  /*
  console.log('SOURCE', source)

  const target = nodes[1]
  console.log('TARGET', target)
  links.push({ source, target })
  */

  stuff.links.slice(15).forEach((z, i) => {
    const target = nodes[i + 1]
    // console.log('TARGET', target)
    if (!target) return
    links.push({ source, target })
  })
  // stuff.links.forEach(({source, target}) => links.push({ source, target }))
  console.log("LINKS", links.length, links.slice(0)[0])
  restart()
}, 200)

d3.timeout(function() {
  // links = stuff.links.map(({source, target}) => ({ source: {id: source}, target: {id : target}}))
  const source = nodes[25]

  /*
  console.log('SOURCE', source)

  const target = nodes[1]
  console.log('TARGET', target)
  links.push({ source, target })
  */

  stuff.links.forEach((z, i) => {
    const target = nodes[i + 30]
    // console.log('TARGET', target)
    if (!target) return
    links.push({ source, target })
  })
  // stuff.links.forEach(({source, target}) => links.push({ source, target }))
  console.log("LINKS", links.length, links.slice(0)[0])
  restart()
}, 1200)

d3.timeout(function() {
  // links = stuff.links.map(({source, target}) => ({ source: {id: source}, target: {id : target}}))
  const source = nodes[15]

  /*
  console.log('SOURCE', source)

  const target = nodes[1]
  console.log('TARGET', target)
  links.push({ source, target })
  */

  stuff.links.forEach((z, i) => {
    const target = nodes[i + 20]
    // console.log('TARGET', target)
    if (!target) return
    links.push({ source, target })
  })
  // stuff.links.forEach(({source, target}) => links.push({ source, target }))
  console.log("LINKS", links.length, links.slice(0)[0])
  restart()
}, 2000)

d3.timeout(function() {
  simulation.stop()
}, 50000)

/*
d3.timeout(function() {
  links.push({ source: a, target: b }) // Add a-b.
  links.push({ source: b, target: c }) // Add b-c.
  links.push({ source: c, target: a }) // Add c-a.
  restart()
}, 1000)

d3.interval(
  function() {
    nodes.pop() // Remove c.
    links.pop() // Remove c-a.
    links.pop() // Remove b-c.
    restart()
  },
  2000,
  d3.now()
)

d3.interval(
  function() {
    nodes.push(c) // Re-add c.
    links.push({ source: b, target: c }) // Re-add b-c.
    links.push({ source: c, target: a }) // Re-add c-a.
    restart()
  },
  2000,
  d3.now() + 1000
)
*/

function restart() {
  // Apply the general update pattern to the nodes.
  node = node.data(nodes, function(d) {
    return d.id
  })
  node.exit().remove()
  node = node
    .enter()
    .append("circle")
    .attr("fill", function(d) {
      return color(d.id)
    })
    .attr("r", 8)
    .merge(node)

  // Apply the general update pattern to the links.
  link = link.data(links, function(d) {
    return d.source.id + "-" + d.target.id
  })
  link.exit().remove()
  link = link
    .enter()
    .append("line")
    .merge(link)

  // Update and restart the simulation.
  simulation.nodes(nodes)
  simulation.force("link").links(links)
  simulation.alpha(1).restart()
}

function ticked() {
  node
    .attr("cx", function(d) {
      return d.x
    })
    .attr("cy", function(d) {
      return d.y
    })

  link
    .attr("x1", function(d) {
      return d.source.x
    })
    .attr("y1", function(d) {
      return d.source.y
    })
    .attr("x2", function(d) {
      return d.target.x
    })
    .attr("y2", function(d) {
      return d.target.y
    })
}
