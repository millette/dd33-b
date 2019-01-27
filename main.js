// taken from https://bl.ocks.org/mbostock/1095795

// npm
import delay from "delay"
import uniq from "lodash.uniq"
import riot from "riot"

// self
import "./tags/index.js"
import ask from "./query.js"
import d3, { d3Event } from "./d3.js"

const dragRe = /^translate\((-{0,1}[0-9]+),(-{0,1}[0-9]+)\)$/

const dragged = () => {
  const [dx, dy] = g
    .attr("transform")
    .match(dragRe)
    .slice(1, 3)
  g.attr(
    "transform",
    `translate(${parseInt(dx, 10) + d3Event.dx},${parseInt(dy, 10) +
      d3Event.dy})`
  )
}

const zoomed = (a, b, c, d) =>
  svg.attr(
    "viewBox",
    `0 0 ${Math.round(width / d3Event.transform.k)} ${Math.round(
      height / d3Event.transform.k
    )}`
  )

const svg = d3
  .select("svg")
  .call(d3.drag().on("drag", dragged))
  .call(d3.zoom().on("zoom", zoomed))

const width = parseInt(svg.attr("width"), 10)
const height = parseInt(svg.attr("height"), 10)
const color = d3.scaleOrdinal(d3.schemeCategory10)

const dataNodes = []
const dataLinks = []

const hereRe = /(montréal|montreal|mtl|yul)/

const g = svg
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`)

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
  .force("charge", d3.forceManyBody().strength(-200))
  .force("link", d3.forceLink(dataLinks).distance(48))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .alphaTarget(0.25)
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
    .attr("fill", (d) => color(d.id))
    .attr("r", 12)
    .merge(node)
    .on(
      "click",
      ({ id }) =>
        d3Event.shiftKey ? fetchFollows(id, hereRe) : fetchOne(id, hereRe),
      { capture: false, once: true, passive: true }
    )

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
  simulation.alpha(0.75).restart()
}

restart()

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

const fetchOne = (name, re) => {
  // stop after a little while
  d3.timeout(() => simulation.stop(), 60000)

  return ask(process.env.HELLO, name).then(
    ({
      data: {
        rateLimit,
        user: {
          login: nameSource,
          followers: { nodes },
          following: { n2 },
        },
      },
    }) => {
      const source = addUser(nameSource)
      nodes = nodes.filter(
        ({ location }) => location && re.test(location.toLowerCase())
      )
      nodes.forEach(({ login }) => addLink(source, addUser(login)))

      n2 = n2.filter(
        ({ location }) => location && re.test(location.toLowerCase())
      )
      n2.forEach(({ login }) => addLink(addUser(login), source))
      restart()
      elApp.rateLimit = rateLimit
      return uniq([
        ...nodes.map(({ login }) => login),
        ...n2.map(({ login }) => login),
      ])
    }
  )
}

const delayedFetch = (name, re, ms) => delay(ms).then(() => fetchOne(name, re))

const fetchFollows = (name, re) =>
  fetchOne(name, re)
    .then((zzz) =>
      Promise.all(zzz.map((u, i) => delayedFetch(u, re, 1000 + i * 500)))
    )
    .catch((e) => {
      console.error(e)
      simulation.stop()
    })

const clearGraph = () => {
  dataNodes.length = 0
  dataLinks.length = 0
  restart()
}

riot.mixin({
  fetchFollows,
  fetchOne,
  clearGraph,
})

const elApp = riot.mount("app", { dataNodes, dataLinks, rateLimit: {} })[0]
