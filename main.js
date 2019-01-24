// taken from https://bl.ocks.org/mbostock/1095795

import d3 from "./d3.js"

const svg = d3.select("svg")
const width = +svg.attr("width")
const height = +svg.attr("height")
const color = d3.scaleOrdinal(d3.schemeCategory10)

import stuff from "./el-graph-data.json"

const nodes = stuff.nodes
const links = []

const g = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

let link = g
  .append("g")
  .attr("stroke", "#000")
  .attr("stroke-width", 1)
  .selectAll(".link")

let node = g
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 2)
  .selectAll(".node")

const ticked = () => {
  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)

  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y)
}

const simulation = d3
  .forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-150))
  .force("link", d3.forceLink(links).distance(50))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .alphaTarget(1)
  .on("tick", ticked)

const restart = () => {
  // Apply the general update pattern to the nodes.
  // node = node.data(nodes, (d) => d.id)
  node = node.data(nodes)
  node.exit().remove()
  node = node
    .enter()
    .append("circle")
    .attr("title", (d) => d.id)
    .attr("fill", (d) => color(d.id))
    .attr("r", 8)
    .merge(node)

  // Apply the general update pattern to the links.
  link = link.data(links, (d) => d.source.id + "-" + d.target.id)
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

restart()

const fakeIt = () => {
  d3.timeout(() => {
    const source = nodes[0]

    stuff.links.slice(15).forEach((z, i) => {
      const target = nodes[i + 1]
      if (target) links.push({ source, target })
    })
    restart()
  }, 200)

  d3.timeout(() => {
    const source = nodes[25]

    stuff.links.forEach((z, i) => {
      const target = nodes[i + 30]
      if (target) links.push({ source, target })
    })
    restart()
  }, 500)

  d3.timeout(() => {
    const source = nodes[15]

    stuff.links.forEach((z, i) => {
      const target = nodes[i + 20]
      if (target) links.push({ source, target })
    })
    restart()
  }, 1000)
}

fakeIt()

// stop after 50 seconds
d3.timeout(() => simulation.stop(), 1300)
