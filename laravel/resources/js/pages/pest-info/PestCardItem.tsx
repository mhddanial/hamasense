import { useState } from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Pest } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bug, Sprout, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PestCardItemProps {
    pest: Pest;
    getRiskColor: (level: string) => string;
}

export default function PestCardItem({ pest, getRiskColor }: PestCardItemProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Link
            href={route("pest.user.show", pest.id)}
            className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        >
            {/* Image Wrapper */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Skeleton className="h-full w-full" />
                    </div>
                )}

                {pest.image_path ? (
                    <img
                        src={`${pest.image_path}`}
                        alt={pest.name}
                        className={cn(
                            "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
                            isLoaded ? "opacity-100" : "opacity-0"
                        )}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        <Bug className="h-12 w-12 opacity-20" />
                    </div>
                )}

                {/* Category Badge (Overlay) */}
                <div className="absolute left-2 top-2">
                    <Badge
                        variant="secondary"
                        className="border-0 bg-white/90 text-xs font-medium text-black shadow-sm backdrop-blur-sm"
                    >
                        {pest.category}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col space-y-3 p-5">
                <div>
                    <div className="mb-1 flex items-start justify-between">
                        <h3 className="text-lg font-bold leading-tight transition-colors group-hover:text-primary">
                            {pest.name}
                        </h3>
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                        {pest.scientific_name}
                    </p>
                </div>

                {/* Plant Types */}
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Sprout className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">
                        {pest.plant_types && pest.plant_types.length > 0
                            ? pest.plant_types.map((p: any) => p.name).join(", ")
                            : "Umum"}
                    </span>
                </div>

                {/* Footer: Risk & Action */}
                <div className="mt-auto flex items-center justify-between border-t pt-4">
                    <Badge
                        variant="outline"
                        className={`${getRiskColor(pest.risk_level)} border-0`}
                    >
                        {pest.risk_level}
                    </Badge>

                    <span className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
