import { useMemo } from 'react'
import { pluck, apply, juxt, compose, applySpec, prop, evolve } from 'ramda'

const extent = apply(juxt([Math.min, Math.max]))

const padDomain = domain => {
  const [lower, upper] = domain
  const diff = upper - lower
  const pad = diff * 0.05
  return [lower - pad, upper + pad]
}

const useExtent = (key = 'x', data) =>
  useMemo(() => {
    const computedExtent = compose(
      extent,
      pluck(key)
    )(data)
    return computedExtent
  }, [key, data])

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

export { useExtent, getCoordinates, scalePoint, padDomain }
