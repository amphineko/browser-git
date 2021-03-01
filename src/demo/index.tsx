import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

import { Application } from './app'

const container = document.createElement('div')
document.body.insertBefore(container, null)

ReactDOM.render((
    <HashRouter basename="git-browser">
        <Application
            corsProxy='https://cors.isomorphic-git.org'
            defaultRepositoryUrl='https://github.com/amphineko/atomicneko'
        />
    </HashRouter>
), container)
