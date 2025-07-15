"use client";
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import GDiscus from '@giscus/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { TocItem } from 'remark-flexible-toc';

export function ClientMdx({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return <MDXRemote {...mdxSource} />;
}


interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export const TableOfContents = ({ items, className = "" }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Configure scroll awareness
  useEffect(() => {
    const handleObserver: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px -50% 0px',
      threshold: [0.5, 1]
    });

    items.forEach((item) => {
      const element = document.getElementById(item.href.slice(1));
      if (element) observer.current?.observe(element);
    });

    return () => observer.current?.disconnect();
  }, [items]);

  // Handle smooth scrolling
  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (target) {
      window.history.replaceState(null, '', href);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const depthClass = {
    1: 'pl-0 font-medium',
    2: 'pl-4',
    3: 'pl-8 text-sm',
    4: 'pl-12 text-sm',
    5: 'pl-16 text-xs',
    6: 'pl-20 text-xs'
  };

  return (
    <motion.div
      className={cn('max-h-[80vh] overflow-hidden bg-inherit', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-card-foreground flex items-center gap-2">
          <Icon name='toc' className="size-4" />
          Table of Contents
        </h2>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="icon_sm"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto pr-2 toc-scrollbar no-scrollbar"
          >
            <ul className="space-y-2 border-l">
              {items.map((item) => {
                const id = item.href.slice(1);
                const isActive = activeId === id;

                return (
                  <motion.li
                    key={id}
                    className={`relative ${depthClass[item.depth]}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.depth * 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href)}
                      className={`block py-1 pr-3 transition-all duration-200 items-baseline text-sm ${isActive
                          ? 'text-primary scale-103'
                          : 'text-muted-foreground'
                        }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="toc-active-indicator"
                          className="absolute left-0 w-0.5 h-full bg-primary-500 dark:bg-primary-400 rounded-full"
                          initial={false}
                        />
                      )}
                      {item.value}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


export function CommentSection() {
  const { resolvedTheme } = useTheme();
  const gDiscusTheme = resolvedTheme !== 'light' ? 'dark_protanopia' : 'light';
  return (
    <div className="comment-section w-full flex-auto">
      <GDiscus
        id="comments"
        repo="kanakkholwal/college-ecosystem"
        repoId="R_kgDOMKgxsg"
        // category="Announcements"
        // data-category-id="[ENTER CATEGORY ID HERE]"
        // categoryId="DIC_kwDOF1L2fM4B-hVS"
        mapping="pathname"
        term="Welcome to the College Ecosystem!"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={gDiscusTheme}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}