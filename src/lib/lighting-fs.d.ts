declare module '@isomorphic-git/lightning-fs' {
    export class Options {
        wipe: boolean
    }

    export default class FS {
        constructor(name: string, opts?: Options)
    }
}