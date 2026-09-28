import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SearchCardSkeleton() {
    return (
        <Card aria-hidden className="gap-4 overflow-hidden pt-0">
            <Skeleton className="aspect-video w-full rounded-none" />
            <CardHeader className="gap-3 px-5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2 px-5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
            </CardContent>
        </Card>
    );
}
