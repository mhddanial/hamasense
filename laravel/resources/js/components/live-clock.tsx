import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format: Senin, 29 Nov 2025
    const dateStr = time.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // Format: 10:30:45
    const timeStr = time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5 text-sm font-medium text-muted-foreground border shadow-sm">
            <Clock className="h-4 w-4" />
            <span>{dateStr}</span>
            <span className="w-px h-4 bg-border mx-1"></span>
            <span className="tabular-nums font-mono text-foreground">{timeStr}</span>
        </div>
    );
}