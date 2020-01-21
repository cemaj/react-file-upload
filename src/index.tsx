import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from './global-style'
// import { Spinner } from './components/shared/spinner'
import { UploadFile } from './components/shared/upload-file'

console.info(`⚛️ ${React.version}`)

const App = () => (
  <>
    <GlobalStyle />
    {/* <Spinner /> */}
    <UploadFile />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))

module.hot && module.hot.accept()
