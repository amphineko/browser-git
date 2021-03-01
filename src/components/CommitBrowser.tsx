import React, { useMemo } from 'react'
import { ReadCommitResult } from 'isomorphic-git'
import { DateTime } from 'luxon'

export function Commit(props: {
    commit: ReadCommitResult
}): JSX.Element {
    const { commit: result } = props
    const { commit } = result

    const date = DateTime.fromSeconds(commit.committer.timestamp).toRelative()

    return (
        <div>
            <div>
                <div><a href="#">{commit.message}</a> # {result.oid}</div>
                <div>
                    <span>{commit.committer.name}</span> committed on <span>{date}</span>
                </div>
            </div>
        </div>
    )
}

export function CommitBrowser(props: {
    commits: ReadCommitResult[]
}): JSX.Element {
    const { commits } = props

    const items = useMemo(() => {
        return commits.map((commit) => (
            <li key={commit.oid}>
                <Commit commit={commit} />
            </li>
        ))
    }, [commits])

    return (
        <ol>
            {items}
        </ol>
    )
}
