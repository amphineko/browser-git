import git, { CallbackFsClient, GitProgressEvent, ProgressCallback, PromiseFsClient } from 'isomorphic-git'
import http from 'isomorphic-git/http/web'

export type Filesystem = CallbackFsClient & PromiseFsClient

const DefaultDir = '/'

export type RepositoryInit = {
    corsProxy?: string
    onProgress?: ProgressCallback
}

export class Repository {
    private corsProxy?: string
    private fs: Filesystem

    private constructor(fs: Filesystem, options?: RepositoryInit) {
        this.corsProxy = options?.corsProxy
        this.fs = fs
    }

    public static async clone(url: string, fs: Filesystem, options?: RepositoryInit) {
        await git.clone({
            corsProxy: options?.corsProxy,
            depth: 1, // limit to 1, and lazily fetch on checkout
            dir: DefaultDir,
            fs,
            http,
            onProgress: options?.onProgress,
            url
        })
        return new Repository(fs, options)
    }

    public static async init(fs: Filesystem, options?: RepositoryInit) {
        await git.init({ dir: DefaultDir, fs })
        return new Repository(fs, options)
    }

    public static async open(fs: Filesystem, options?: RepositoryInit) {
        const path = await git.findRoot({ filepath: DefaultDir, fs })
        if (path !== DefaultDir) {
            // TODO: add better detection of valid repository
            throw new Error('Filesystem is not a valid repository')
        }
        return new Repository(fs, options)
    }

    public currentBranch = async () => await git.currentBranch({
        dir: DefaultDir,
        fs: this.fs
    })

    public findRoot = async () => await git.findRoot({
        filepath: DefaultDir,
        fs: this.fs
    })

    public log = async () => await git.log({
        depth: 100,
        dir: DefaultDir,
        fs: this.fs
    })
}