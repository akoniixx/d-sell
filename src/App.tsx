import React from 'react'
import './App.css'
import WebRoutes from './WebRoutes'
import 'antd/dist/antd.min.css'
import { RecoilRoot } from 'recoil'

function App() {
  return (
    <RecoilRoot>
      <WebRoutes />
    </RecoilRoot>
  )
}

export default App
