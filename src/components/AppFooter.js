import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a rel="noopener noreferrer">
          SIS ÁGUIA
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a rel="noopener noreferrer">
         Yellow Sistemas
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
