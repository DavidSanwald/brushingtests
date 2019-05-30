import { range, random } from 'lodash'
import uuidv1 from 'uuid/v1'
import seedrandom from 'seedrandom'

// const polarData = [
//   { x: 45, y: 2 },
//   { x: 90, y: 3 },
//   { x: 135, y: 5 },
//   { x: 180, y: 4 },
//   { x: 225, y: 7 },
//   { x: 270, y: 2 },
//   { x: 315, y: 4 },
//   { x: 360, y: 7 }
// ];

const getTimeData = (num, seed) => {
  seed = seed || 'getData'
  const baseSeed = seedrandom(seed)
  const rand = () => baseSeed.quick() * 10
  const current = 1523389495000
  return range(num).map(v => {
    return {
      x: new Date((current / num) * (v + 1)),
      y: rand()
    }
  })
}

const getData = (num, seed) => {
  seed = seed || 'getData'
  const baseSeed = seedrandom(seed)
  const rand = () => baseSeed.quick() * 10
  return range(num).map(v => ({ x: v + 1, y: rand(), id: uuidv1() }))
}

const getDescendingSmallData = () => {
  return [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 0.5 },
    { x: 4, y: 0.2 },
    { x: 5, y: 0.1 },
    { x: 6, y: -0.1 },
    { x: 7, y: -0.2 },
    { x: 8, y: -0.5 },
    { x: 9, y: -1 },
    { x: 10, y: -2 }
  ]
}

const getStringData = (num, seed) => {
  seed = seed || 'getData'
  const baseSeed = seedrandom(seed)
  const rand = () => baseSeed.quick() * 10
  return range(num).map(v => ({ x: `#${v + 1}`, y: rand() }))
}

const getLogData = (num, seed) => {
  seed = seed || 'getData'
  const baseSeed = seedrandom(seed)
  const rand = () => baseSeed.quick() * 100000
  return range(num).map(v => ({ x: v + 1, y: rand() }))
}

const getMixedData = (num, seed) => {
  seed = seed || 'getMixedData'
  const baseSeed = seedrandom(seed)
  const rand = () => baseSeed.quick() * 10 - 5
  return range(num).map(v => ({ x: v + 1, y: rand() }))
}

const getFourQuadrantData = (num, seed) => {
  seed = seed || 'getMixedData'
  const baseSeed = seedrandom(seed)
  const rand = () => baseSeed.quick() * 10 - 5
  return range(num).map(v => ({ x: v - Math.round(num / 2), y: rand() }))
}

const getArrayData = (num, samples) => {
  const seed = 'getData'
  samples = samples || 10
  const baseSeed = seedrandom(seed)
  const rand = () => baseSeed.quick() * 10
  return range(num).map(v => {
    return {
      x: v + 1,
      y: range(samples).map(() => rand())
    }
  })
}

const generateScatterData = () => {
  const colors = [
    'violet',
    'cornflowerblue',
    'gold',
    'orange',
    'turquoise',
    'tomato',
    'greenyellow'
  ]
  const symbols = [
    'circle',
    'star',
    'square',
    'triangleUp',
    'triangleDown',
    'diamond',
    'plus'
  ]
  const elementNum = random(10, 40)
  return range(elementNum * 2).map(index => {
    const scaledIndex = Math.floor(index % 7)
    return {
      x: random(10, 50),
      y: random(2, 100),
      kind: random(0, 6),
      size: random(8) + 3,
      symbol: symbols[scaledIndex],
      fill: colors[random(0, 5)],
      opacity: 1,
      id: uuidv1()
    }
  })
}
const getAreaTransitionData = () => {
  const areas = random(6, 10)
  return range(areas).map(area => {
    return { x: area, y: random(2, 10) }
  })
}
const getStackedData = (num, samples, useStrings) => {
  return range(num).map(() => {
    return useStrings ? getStringData(samples) : getData(samples)
  })
}

export {
  getData,
  getStringData,
  getMixedData,
  getTimeData,
  getLogData,
  getFourQuadrantData,
  getArrayData,
  getStackedData,
  getDescendingSmallData,
  generateScatterData,
  getAreaTransitionData
}
