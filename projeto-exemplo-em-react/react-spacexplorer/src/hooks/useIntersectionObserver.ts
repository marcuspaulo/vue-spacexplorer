import { useEffect, useEffectEvent, useState } from 'react';

interface UseIntersectionObserverOptions {
    onIntersect: () => void;
    enabled?: boolean;
    rootMargin?: string;
    threshold?: number;
}

/**
 * Calls `onIntersect` when the element attached to the returned callback ref
 * enters the viewport. Re-subscribes whenever `enabled` flips back on, so a
 * sentinel that is still visible after a page loads triggers the next one.
 */
export function useIntersectionObserver({
    onIntersect,
    enabled = true,
    rootMargin = '0px',
    threshold = 0,
}: UseIntersectionObserverOptions) {
    const [element, setElement] = useState<Element | null>(null);
    const handleIntersect = useEffectEvent(onIntersect);

    useEffect(() => {
        if (!element || !enabled) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) handleIntersect();
            },
            { rootMargin, threshold }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [element, enabled, rootMargin, threshold]);

    return setElement;
}
