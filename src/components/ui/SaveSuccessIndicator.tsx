import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SaveSuccessIndicatorProps } from "@/lib/types";

export function SaveSuccessIndicator({
  isVisible,
  message,
}: SaveSuccessIndicatorProps) {
  return (
    <div
      className={cn(
        "absolute right-full top-1/2 -translate-y-1/2 mr-4 flex items-center gap-2 whitespace-nowrap text-sm font-medium text-green-600 transition-all duration-500 ease-in-out",
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4 pointer-events-none",
      )}
    >
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}
