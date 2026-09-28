import { cva } from 'class-variance-authority';

export const mediaBadgeVariants = cva('capitalize', {
    variants: {
        mediaType: {
            image: 'border-cyan-500/50 text-cyan-600 dark:text-cyan-400',
            video: 'border-violet-500/50 text-violet-600 dark:text-violet-400',
            audio: 'border-amber-500/50 text-amber-600 dark:text-amber-400',
        },
    },
});
