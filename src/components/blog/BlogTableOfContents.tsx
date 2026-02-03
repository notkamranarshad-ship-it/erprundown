import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  content: string;
}

export function BlogTableOfContents({ content }: BlogTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from HTML content
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    
    const items: TocItem[] = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      return {
        id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      };
    });

    setTocItems(items);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <List className="h-4 w-4" />
        Table of Contents
      </div>
      <ul className="space-y-2 border-l-2 border-border pl-4">
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={cn(
              "transition-colors",
              item.level === 3 && "ml-3"
            )}
          >
            <button
              onClick={() => scrollToHeading(item.id)}
              className={cn(
                "text-left text-sm leading-relaxed hover:text-primary transition-colors",
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
