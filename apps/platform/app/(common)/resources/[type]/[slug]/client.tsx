"use client";
import GDiscus from '@giscus/react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from 'next-themes';

export function ClientMdx({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
    return <MDXRemote {...mdxSource} />;
}


export function CommentSection() {
    const {resolvedTheme } = useTheme();
    const gDiscusTheme = resolvedTheme  !== 'light' ? 'dark_protanopia' : 'light';
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