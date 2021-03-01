import { DependencyList, useEffect, useState } from "react";

export function useAsyncMemo<T>(factory: () => Promise<T>, deps: DependencyList | undefined, initialValue: T): T

export function useAsyncMemo<T>(factory: () => Promise<T>, deps: DependencyList | undefined, initialValue?: T): T | undefined {
    const [state, setState] = initialValue === undefined ? useState<T>() : useState<T>(initialValue)
    useEffect(() => {
        let cancelled = false
        factory().then((state) => !cancelled && setState(state))
        return () => { cancelled = true }
    }, deps)
    return state
}
