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

export default {
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
