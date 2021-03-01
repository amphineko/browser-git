import git, { CallbackFsClient, ProgressCallback, PromiseFsClient, ReadCommitResult } from 'isomorphic-git'
import http from 'isomorphic-git/http/web'

export type Filesystem = CallbackFsClient & PromiseFsClient

const DefaultDir = '/'

export interface RepositoryInit {
    corsProxy?: string
    onProgress?: ProgressCallback
}

export class Repository {
    private readonly corsProxy?: string
    private readonly fs: Filesystem

    private constructor(fs: Filesystem, options?: RepositoryInit) {
        this.corsProxy = options?.corsProxy
        this.fs = fs
    }

    public static async clone(url: string, fs: Filesystem, options?: RepositoryInit): Promise<Repository> {
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

    public static async init(fs: Filesystem, options?: RepositoryInit): Promise<Repository> {
        await git.init({ dir: DefaultDir, fs })
        return new Repository(fs, options)
    }

    public static async open(fs: Filesystem, options?: RepositoryInit): Promise<Repository> {
        const path = await git.findRoot({ filepath: DefaultDir, fs })
        if (path !== DefaultDir) {
            // TODO: add better detection of valid repository
            throw new Error('Filesystem is not a valid repository')
        }
        return new Repository(fs, options)
    }

    public currentBranch = async (): Promise<string> => await git.currentBranch({
        dir: DefaultDir,
        fs: this.fs
    }) as string // TODO: fix this typing

    public findRoot = async (): Promise<string> => await git.findRoot({
        filepath: DefaultDir,
        fs: this.fs
    })

    public log = async (): Promise<ReadCommitResult[]> => await git.log({
        depth: 100,
        dir: DefaultDir,
        fs: this.fs
    })
}
