import { transpose } from 'ramda'
const range = n => Array.from(Array(n), (d, i) => i)

const numLayers = 20
const samplesPerLayer = 25
const bumpsPerLayer = 10

const keys = range(numLayers)

function bumps(n, m) {
  const a = []

  let i
  for (i = 0; i < n; ++i) a[i] = 0
  for (i = 0; i < m; ++i) bump(a, n)
  return a
}

function bump(a, n) {
  let x = 1 / (0.1 + Math.random())

  let y = 2 * Math.random() - 0.5

  let z = 10 / (0.1 + Math.random())
  for (let i = 0; i < n; i++) {
    let w = (i / n - y) * z
    a[i] += x * Math.exp(-w * w)
  }
}
export default () =>
  transpose(keys.map(d => bumps(samplesPerLayer, bumpsPerLayer)))
