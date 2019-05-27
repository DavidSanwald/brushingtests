import { useMemo } from 'react'
import { pluck, apply, juxt, compose } from 'ramda'

const extent = apply(juxt([Math.min, Math.max]))

const useExtent = (key = 'x', data) =>
  useMemo(() => {
    const computedExtent = compose(
      extent,
      pluck(key)
    )(data)
    return computedExtent
  }, [key, data])

export { useExtent }
