import { useMemo } from 'react'
import {
  pluck,
  flip,
  contains,
  apply,
  juxt,
  path,
  compose,
  __,
  applySpec,
  prop
} from 'ramda'

const extent = apply(juxt([Math.min, Math.max]))

const useExtent = (key = 'x', data) =>
  useMemo(() => {
    const computedExtent = compose(
      extent,
      pluck(key)
    )(data)
    console.log(computedExtent)
    return computedExtent
  }, [key, data])

export { useExtent }
