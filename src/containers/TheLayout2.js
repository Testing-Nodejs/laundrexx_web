import React from 'react'
import {
  TheContent,
  TheSidebar2,
  TheFooter,
  TheHeader
} from './index2'

const TheLayout = () => {

  return (
    <div className="c-app c-default-layout">
      <TheSidebar2/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
