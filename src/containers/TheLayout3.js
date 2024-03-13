import React from 'react'
import {
  TheContent,
  TheSidebar3,
  TheFooter,
  TheHeader
} from './index3'

const TheLayout = () => {

  return (
    <div className="c-app c-default-layout">
      <TheSidebar3/>
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
