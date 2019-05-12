import {
  compose,
  prop,
  applySpec,
  evolve,
  useWith,
  lte,
  map,
  where,
  ifElse,
  gte,
  gt,
  tap,
  propSatisfies,
  both
} from 'ramda'

const inRange = ifElse(
  gte,
  () => {
    throw new Error(
      'low must not be greater than high in inRange(low, high, value)'
    )
  },
  useWith(both, [lte, gt])
)
const getCoordinates = (xKey, yKey) =>
  applySpec({
    projection: {
      x: prop(xKey),
      y: prop(yKey)
    }
  })

const scalePoint = (xScale, yScale) =>
  evolve({
    projection: {
      x: xScale,
      y: yScale
    }
  })

const pred = ({ left, right, top, bottom }) =>
  where({
    x: inRange(left, right + 0.001),
    y: inRange(bottom, top + 0.001)
  })
const isInside = ({ left, right, top, bottom }) =>
  both(propSatisfies(inRange(left, right)), propSatisfies(bottom, top))

export { pred, isInside }
