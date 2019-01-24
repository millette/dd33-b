// taken from https://bl.ocks.org/mbostock/1095795

import d3 from "./d3.js"

console.log(process.env.HELLO)

const svg = d3.select("svg")
const width = +svg.attr("width")
const height = +svg.attr("height")
const color = d3.scaleOrdinal(d3.schemeCategory10)

// import stuff from "./el-graph-data.json"

// const nodes = stuff.nodes
const dataNodes = []
const dataLinks = []

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
  .forceSimulation(dataNodes)
  .force("charge", d3.forceManyBody().strength(-125))
  .force("link", d3.forceLink(dataLinks).distance(200))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .alphaTarget(1)
  .on("tick", ticked)

const makeUser = (d) => {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle")
  const t = document.createElementNS("http://www.w3.org/2000/svg", "title")
  t.textContent = d.id
  c.appendChild(t)
  return c
}

const restart = () => {
  // Apply the general update pattern to the nodes.
  // node = node.data(nodes, (d) => d.id)
  node = node.data(dataNodes)
  node.exit().remove()
  node = node
    .enter()
    .append(makeUser)
    .attr("title", (d) => d.id)
    .attr("fill", (d) => color(d.id))
    .attr("r", 8)
    .merge(node)

  // Apply the general update pattern to the links.
  link = link.data(dataLinks, (d) => d.source.id + "-" + d.target.id)
  link.exit().remove()
  link = link
    .enter()
    .append("line")
    .merge(link)

  // Update and restart the simulation.
  simulation.nodes(dataNodes)
  simulation.force("link").links(dataLinks)
  simulation.alpha(1).restart()
}

restart()

const hereRe = /(montréal|montreal|mtl|yul)/

const addUser = (username) => {
  const found = dataNodes.find((x) => x.id === username)
  if (found) return found
  const it = { id: username }
  dataNodes.push(it)
  return it
}

const addLink = (source, target) =>
  !dataLinks.find(
    (x) => x.source.id === source.id && x.target.id === target.id
  ) && dataLinks.push({ source, target })

const fetchOne = (oyUrl, re) => {
  return fetch(oyUrl)
    .then((res) => res.json())
    .then(({ data: { user: { login, followers: { nodes } } } }) => {
      const source = addUser(login)
      nodes.forEach(
        (x, i) =>
          x.location &&
          re.test(x.location.toLowerCase()) &&
          addLink(source, addUser(x.login))
      )
      console.log("dataNodes.length:", dataNodes.length)
      console.log("dataLinks.length:", dataLinks.length)
      restart()
    })
}

fetchOne(require("./oy.json"), hereRe).catch((e) => {
  console.error(e)
  simulation.stop()
})

const allRe = /(quebec|québec)/

setTimeout(() => {
  fetchOne(require("./oy.json"), allRe).catch((e) => {
    console.error(e)
    simulation.stop()
  })
}, 1000)

// stop after a little while
d3.timeout(() => simulation.stop(), 10000)
