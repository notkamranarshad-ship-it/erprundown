import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  // Process HTML content to add IDs to headings for TOC
  const processedContent = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    
    // Add IDs to headings
    const headings = doc.querySelectorAll("h2, h3");
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const slug = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `heading-${index}`;
        heading.id = slug;
      }
    });

    // Add classes to tables for styling
    const tables = doc.querySelectorAll("table");
    tables.forEach((table) => {
      table.classList.add("blog-table");
      // Wrap in responsive container
      const wrapper = doc.createElement("div");
      wrapper.className = "blog-table-wrapper overflow-x-auto my-6 rounded-lg border border-border";
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Add classes to blockquotes
    const blockquotes = doc.querySelectorAll("blockquote");
    blockquotes.forEach((quote) => {
      quote.classList.add("blog-quote");
    });

    // Add classes to images
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
      img.classList.add("rounded-lg", "my-6");
      // Add caption support if alt text exists
      if (img.alt && img.parentElement?.tagName !== "FIGURE") {
        const figure = doc.createElement("figure");
        figure.className = "my-8";
        img.parentNode?.insertBefore(figure, img);
        figure.appendChild(img);
        
        if (img.alt) {
          const caption = doc.createElement("figcaption");
          caption.className = "text-center text-sm text-muted-foreground mt-2";
          caption.textContent = img.alt;
          figure.appendChild(caption);
        }
      }
    });

    // Add classes to code blocks
    const codeBlocks = doc.querySelectorAll("pre");
    codeBlocks.forEach((pre) => {
      pre.classList.add("blog-code-block");
    });

    return doc.body.innerHTML;
  }, [content]);

  return (
    <div 
      className={cn(
        "prose prose-lg max-w-none",
        // Headings
        "prose-headings:font-bold prose-headings:text-foreground",
        "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:scroll-mt-24",
        "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-24",
        // Paragraphs
        "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4",
        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Lists
        "prose-ul:my-4 prose-ol:my-4",
        "prose-li:text-muted-foreground prose-li:marker:text-primary",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30",
        "prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic",
        "prose-blockquote:text-foreground",
        // Code
        "prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-muted prose-pre:rounded-lg prose-pre:overflow-x-auto",
        // Tables
        "[&_.blog-table]:w-full [&_.blog-table]:text-sm",
        "[&_.blog-table_th]:bg-muted [&_.blog-table_th]:text-foreground [&_.blog-table_th]:font-semibold",
        "[&_.blog-table_th]:p-3 [&_.blog-table_th]:text-left",
        "[&_.blog-table_td]:p-3 [&_.blog-table_td]:border-t [&_.blog-table_td]:border-border",
        "[&_.blog-table_tr:hover]:bg-muted/30",
        // Images
        "prose-img:rounded-lg prose-img:mx-auto",
        // Strong
        "prose-strong:text-foreground",
      )}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
