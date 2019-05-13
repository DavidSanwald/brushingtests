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
const isInside = curry((area, point) => {
  const { top, left, right, bottom } = area
  const { x, y } = point
  const xRange = sort((a, b) => a - b, [left, right])
  const yRange = sort((a, b) => a - b, [top, bottom])

  const isInsideX = xRange[0] < x && x < xRange[1] + 0.00001
  const isInsideY = yRange[0] < y && y < yRange[1] + 0.00001
  return !isInsideX || !isInsideY
})

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
export { pred, isInside, inRange }
