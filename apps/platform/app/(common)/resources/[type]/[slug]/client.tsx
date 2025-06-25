"use client";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

export function ClientMdx({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
    return <MDXRemote {...mdxSource} />;
}