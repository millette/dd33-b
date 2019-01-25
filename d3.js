import { zoom } from "d3-zoom"
import { drag } from "d3-drag"
import { select } from "d3-selection"
import { scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"
import { timeout, interval, now } from "d3-timer"
import {
  forceLink,
  forceX,
  forceY,
  forceManyBody,
  forceSimulation,
} from "d3-force"

// Needed for live binding (d3.event is manipulated during use)
export { event as d3Event } from "d3-selection/src/selection/on"

export default {
  zoom,
  drag,
  select,
  scaleOrdinal,
  schemeCategory10,
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
  timeout,
  interval,
  now,
}
