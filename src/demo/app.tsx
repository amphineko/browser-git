import React, { useReducer } from "react"
import { Redirect, Route, Switch, useRouteMatch } from "react-router"

import { CommitBrowser } from "../components/CommitBrowser"
import { RepositoryInitForm } from "../components/RepositoryInitForm"
import { Repository } from "../lib/repositories"
import { useAsyncMemo } from "../lib/useAsyncMemo"

function repositoryReducer(_: any, newRepository: { name: string | null, repository: Repository | null }) {
    const { name, repository } = newRepository
    if ((name === null && repository !== null) || (name !== null && repository === null)) {
        throw new Error('Inconsistent repository-name pair')
    }

    return newRepository
}

export function Application(props: {
    corsProxy: string
    defaultRepositoryUrl: string
}): JSX.Element {
    const { corsProxy } = props

    const [{ repository, name: repositoryName }, setRepository] = useReducer(repositoryReducer, { name: null, repository: null })

    const commits = useAsyncMemo(async () => {
        return repository === null ? [] : await repository.log()
    }, [repository], [])

    const { path, url } = useRouteMatch()

    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="start" />
            </Route>

            <Route path="/start">
                {repository !== null && <Redirect to={`/commits`} />}
                <RepositoryInitForm
                    initOptions={{ corsProxy }}
                    ready={(name, repo) => {
                        setRepository({ name: name, repository: repo })
                    }}
                />
            </Route>

            {/* <Route path="/r/:name/commits"> */}
            <Route path="/commits">
                <CommitBrowser commits={commits} />
            </Route>
        </Switch>
    )
}
