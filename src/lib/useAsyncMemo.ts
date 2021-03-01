import { DependencyList, useEffect, useState } from 'react'

export function useAsyncMemo<T>(factory: () => Promise<T>, deps: DependencyList | undefined, initialValue: T): T

export function useAsyncMemo<T>(factory: () => Promise<T>, deps: DependencyList | undefined, initialValue?: T): T | undefined {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [state, setState] = initialValue === undefined ? useState<T>() : useState<T>(initialValue)
    // NOTE: anyway, useState is not conditionally called there. it's just a typing workaround

    useEffect(() => {
        let cancelled = false
        factory().then((state) => !cancelled && setState(state)).catch(() => { })
        return () => { cancelled = true }

        // TODO: fix this react hooks linting
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return state
}
