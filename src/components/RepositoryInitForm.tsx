import FS from '@isomorphic-git/lightning-fs'
import uniqueId from 'lodash/uniqueId'
import React, { useRef, useState } from 'react'
import { Filesystem, Repository, RepositoryInit } from '../lib/repositories'

function CloneForm(props: {
    onSubmit: (name: string, url: string) => void
}): JSX.Element {
    const { onSubmit } = props

    const nameInput = useRef<HTMLInputElement>(null)
    const nameInputId = uniqueId('input-')
    const urlInput = useRef<HTMLInputElement>(null)
    const urlInputId = uniqueId('input-')

    return (
        <form>
            <label htmlFor={nameInputId}>Name</label>
            <input id={nameInputId} ref={nameInput} />
            <label htmlFor={urlInputId}>Repository URL</label>
            <input id={urlInputId} ref={urlInput} />
            <input
                onClick={(e): void => {
                    e.preventDefault()
                    onSubmit(nameInput.current?.value ?? '', urlInput.current?.value ?? '')
                }}
                type="submit"
                value="Clone"
            />
        </form>
    )
}

function InitForm(props: {
    onSubmit: (name: string) => void
}): JSX.Element {
    const { onSubmit } = props

    const nameInput = useRef<HTMLInputElement>(null)
    const nameInputId = uniqueId('input-')

    return (
        <form>
            <label htmlFor={nameInputId}>Name</label>
            <input id={nameInputId} ref={nameInput} />
            <input
                onClick={(e) => {
                    e.preventDefault()
                    onSubmit(nameInput.current?.value ?? '')
                }}
                type="submit"
            />
        </form>
    )
}

const ProgressIndicatorLeadings = {
    active: '⏳ In progress: ',
    failed: '❗ Failed: ',
    ready: '✔ Completed'
}

function ProgressIndicator(props: {
    message: string
    state: 'active' | 'failed' | 'ready'
}): JSX.Element {
    const { message, state } = props

    return (
        <div>
            <strong>{ProgressIndicatorLeadings[state]}</strong>
            <span>{String(message)}</span>
        </div>
    )
}

export function RepositoryInitForm(props: {
    initOptions: RepositoryInit
    ready: (name: string, repo: Repository) => void
}): JSX.Element {
    const { initOptions, ready } = props

    // error of last operation
    const [lastError, setLastError] = useState<string | null>(null)

    // current progress of clone operation
    const [lastProgress, setLastProgress] = useState<string | null>(null)

    async function clone(fs: Filesystem, url: string): Promise<Repository> {
        const options = Object.assign({}, initOptions)
        options.onProgress = (e) => {
            setLastProgress(`${e.phase} (${e.loaded}/${e.total})`)
        }

        setLastProgress('Attempting to fetch from remote')

        return await Repository.clone(url, fs, options).catch((reason) => {
            throw new Error(`Failed to clone: ${reason as string}`)
        })
    }

    async function init(fs: Filesystem): Promise<Repository> {
        setLastProgress('Initializing')

        return await Repository.init(fs, initOptions).catch((reason) => {
            throw new Error(`Failed to init: ${reason as string}`)
        })
    }

    async function start(name: string, callback: (fs: Filesystem) => Promise<Repository>): Promise<void> {
        const fs = new FS(name, { wipe: true }) as Filesystem
        await callback(fs).then((repository) => {
            ready(name, repository)
        }, (reason) => {
            setLastError(reason)
            setLastProgress(null)
            throw reason
        })
    }

    return (
        <div>
            {(lastError !== null || lastProgress !== null) &&
                <ProgressIndicator
                    message={lastError ?? lastProgress ?? ''}
                    state={lastError !== null ? 'failed' : 'active'}
                />}
            <CloneForm onSubmit={async (name, url) => await start(name, async (fs) => await clone(fs, url))} />
            <hr />
            <InitForm onSubmit={async (name) => await start(name, async (fs) => await init(fs))} />
        </div>
    )
}
