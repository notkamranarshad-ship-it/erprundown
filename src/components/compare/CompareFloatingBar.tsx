import { Link } from "react-router-dom";
import { X, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";

export function CompareFloatingBar() {
  const { compareList, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-fade-up">
      <div className="flex items-center gap-3 rounded-full border bg-background px-4 py-2 shadow-lg">
        <BarChart2 className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">
          {compareList.length} vendor{compareList.length !== 1 ? "s" : ""} selected
        </span>
        <Link to="/compare">
          <Button size="sm" className="rounded-full">
            Compare Now
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={clearCompare}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}