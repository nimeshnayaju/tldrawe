import React from 'react'
import ReactDOM from 'react-dom'
import Content from './Content'

const container = document.createElement('div')
document.documentElement.prepend(container)

ReactDOM.render(<Content />, container)
