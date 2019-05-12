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
  both,
  curry,
  sort
} from 'ramda'

const peek = tap(x => console.log(x))

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
    x: compose(inRange(...(sort([left, right]) + 0.001), prop('x'))),
    y: compose(
      inRange(...(sort([bottom, top]) + 0.001)),
      prop('y')
    )
  })
const isInside = ({ left, right, top, bottom, x, y }) => {
  return both(
    inRange(...sort((a, b) => a - b, [left, right + right * 0.001]), x),
    inRange(...sort((a, b) => a - b, [bottom, top + 0.0001]), y)
  )
}

export { pred, isInside, inRange }
