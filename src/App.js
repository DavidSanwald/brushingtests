import React from 'react'
import { Flex, Box } from 'rebass'
import { getData, generateScatterData } from './data/dataGens'
import { getRandomColor, colors } from './colors'
import Chart from './Chart'
const scatterData = generateScatterData()

const App = () => {
  return <Chart data={scatterData} />
}
export default App
