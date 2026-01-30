import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useVendors } from "@/hooks/useVendors";
import { cn } from "@/lib/utils";

export function VendorSearchAutocomplete() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: vendors, isLoading } = useVendors({ search: query });

  const filteredVendors = vendors?.slice(0, 6) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredVendors.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredVendors[selectedIndex]) {
          navigate(`/vendors/${filteredVendors[selectedIndex].slug}`);
          setIsOpen(false);
          setQuery("");
        } else if (query) {
          navigate(`/vendors?search=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleVendorClick = (slug: string) => {
    navigate(`/vendors/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search ERP vendors..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 animate-fade-in rounded-lg border bg-background shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredVendors.length > 0 ? (
            <ul className="py-2">
              {filteredVendors.map((vendor, index) => (
                <li key={vendor.id}>
                  <button
                    onClick={() => handleVendorClick(vendor.slug)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      selectedIndex === index
                        ? "bg-accent/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      {vendor.logo_url ? (
                        <img
                          src={vendor.logo_url}
                          alt={vendor.name}
                          className="h-5 w-5 object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold">
                          {vendor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {vendor.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {vendor.short_description || "ERP Software"}
                      </p>
                    </div>
                    {vendor.featured && (
                      <span className="shrink-0 rounded bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                        Featured
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li className="border-t px-4 py-2">
                <button
                  onClick={() => {
                    navigate(`/vendors?search=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="text-sm text-accent hover:underline"
                >
                  View all results for "{query}" →
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No vendors found for "{query}"
              </p>
              <button
                onClick={() => {
                  navigate("/vendors");
                  setIsOpen(false);
                }}
                className="mt-2 text-sm text-accent hover:underline"
              >
                Browse all vendors
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
