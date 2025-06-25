import fs from 'fs';
import { type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import remarkGfm from 'remark-gfm';
import { calculateReadingTime } from '~/utils/string';
/**
 * Resource types corresponding to folders under /resources
 */
export type ResourceType = 'articles' | 'experiences' | "misc"

/**
 * Expected frontmatter schema for resource MDX files
 */
export interface ResourceFrontMatter {
  title: string;
  slug: string;
  date: string;         // ISO date string
  updated?: string;     // ISO date string, optional
  author?: {
    name: string;
    url: string;
    image?: string;
    bio?: string;
  };
  tags?: string[];
  summary?: string;
  coverImage?: string;
  readingTime?: string;
  published?: boolean;
  featured?: boolean;
  category?: string;
  type: ResourceType; // Optional, can be used to filter by type
}

export const compileMdxSource = async (content: string): Promise<MDXRemoteSerializeResult> => {
  try {
    const mdxSource = await serialize(content,{
      parseFrontmatter: true, // Enable frontmatter parsing
      mdxOptions: {
        // You can add any additional MDX options here if needed
        remarkPlugins: [remarkGfm], // Enable GitHub Flavored Markdown
        
      },
      scope: {}, // You can pass any additional scope variables here
    })
    return mdxSource
  } catch (error) {
    console.error('Error compiling MDX:', error)
    throw new Error('Failed to compile MDX')
  }
}
const RESOURCE_DIR = path.join(process.cwd(), 'resources');

/**
 * Verify that the given resource type is supported
 */
function assertResourceType(type: string): asserts type is ResourceType {
  const types: ResourceType[] = ['articles', 'experiences'];
  if (!types.includes(type as ResourceType)) {
    throw new Error(`Unsupported resource type: ${type}`);
  }
}

/**
 * Get all filenames under a resource type directory (.md or .mdx)
 */
export function getMDXFiles(type: ResourceType): string[] {
  const dirPath = path.join(RESOURCE_DIR, type);
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Resource directory not found: ${dirPath}`);
  }
  return fs.readdirSync(dirPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
}

/**
 * Read a single MDX file by type and slug
 */
export async function getMDXBySlug(
  type: ResourceType,
  slug: string
): Promise<{ mdxSource: MDXRemoteSerializeResult; frontmatter: ResourceFrontMatter }> {
  assertResourceType(type);
  const filename = `${slug}.mdx`;
  const filePathMd = path.join(RESOURCE_DIR, type, filename);
  const filePathMdExt = filePathMd.replace(/\.mdx$/, '.md');

  let fullPath: string;
  if (fs.existsSync(filePathMd)) {
    fullPath = filePathMd;
  } else if (fs.existsSync(filePathMdExt)) {
    fullPath = filePathMdExt;
  } else {
    throw new Error(`MDX file not found for slug: ${slug} in ${type}`);
  }

  const source = fs.readFileSync(fullPath, 'utf-8');
  const mdxSource = await compileMdxSource(source);

  // Validate required frontmatter fields
  if (typeof mdxSource.frontmatter.title !== 'string' || typeof mdxSource.frontmatter.slug !== 'string' || typeof mdxSource.frontmatter.date !== 'string') {
    throw new Error(`Invalid frontmatter in ${fullPath}`);
  }
  mdxSource.frontmatter.readingTime = calculateReadingTime(mdxSource.compiledSource || '');
  mdxSource.frontmatter.type = type;

  return {
    mdxSource: mdxSource,
    frontmatter: mdxSource.frontmatter as unknown as ResourceFrontMatter
  };
}

/**
 * Get frontmatter metadata for all resources of a type, sorted by date desc
 */
export async function getAllMDXMeta(type: ResourceType): Promise<ResourceFrontMatter[]> {
  assertResourceType(type);
  const files = getMDXFiles(type);
  const meta = await Promise.all(files.map(async (filename) => {
    const slug = filename.replace(/\.mdx?$/, '');
    const { frontmatter } = await getMDXBySlug(type, slug);
    frontmatter.type = type; // Add type to frontmatter
    return frontmatter;
  }));

  return meta
    .filter(item => item.published !== false) // Hide unpublished
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all available resource types
 */
export function getResourceTypes(): ResourceType[] {
  return fs.readdirSync(RESOURCE_DIR).filter(dir => {
    const full = path.join(RESOURCE_DIR, dir);
    if (!fs.statSync(full).isDirectory()) return false;
    const files = fs.readdirSync(full).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    return files.length > 0;
  }) as ResourceType[];
}


/**
 * Generate parameters for static paths in Next.js using all types & slugs
 */
export function getAllResourcePaths(): Array<{
  params: { type: ResourceType; slug: string }
}> {
  const types = getResourceTypes();
  const paths: Array<{ params: { type: ResourceType; slug: string } }> = [];

  types.forEach(type => {
    getMDXFiles(type).forEach(async (fn) => {
      const slug = fn.replace(/\.mdx?$/, '');
      const { frontmatter } = await getMDXBySlug(type, slug);
      if (frontmatter.published !== false) {
        paths.push({ params: { type, slug } });
      }
    });
  });

  return paths;
}

/**
 * Filter resources by tag
 */
export async function getResourcesByTag(
  type: ResourceType,
  tag: string
): Promise<ResourceFrontMatter[]> {
  const allResources = await getAllMDXMeta(type);
  return allResources.filter(r => Array.isArray(r.tags) && r.tags.includes(tag));
}

/**
 * Get featured resources of a type
 */
export async function getFeaturedResources(type: ResourceType): Promise<ResourceFrontMatter[]> {
  return (await getAllMDXMeta(type)).filter(r => r.featured === true);
}

/**
 * Get resources by category
 */
export async function getResourcesByCategory(
  type: ResourceType,
  category: string
): Promise<ResourceFrontMatter[]> {
  const allResources = await getAllMDXMeta(type);
  return allResources.filter(r => r.category === category);
}

/**
 * Get recent N resources
 */
export async function getRecentResources(
  type: ResourceType,
  count: number
): Promise<ResourceFrontMatter[]> {
  const allResources = await getAllMDXMeta(type);
  return allResources.slice(0, count);
}

export async function getAllResources(): Promise<ResourceFrontMatter[]> {
  const types = getResourceTypes();
  const allResources: ResourceFrontMatter[] = [];
  for await (const type of types) {
    allResources.push(...(await getAllMDXMeta(type)));
  }
  return allResources;
}

export async function getAllResourcesGroupedByType(): Promise<Record<ResourceType, ResourceFrontMatter[]>> {
  const types = getResourceTypes();
  const grouped: Record<ResourceType, ResourceFrontMatter[]> = {} as Record<ResourceType, ResourceFrontMatter[]>;
  for (const type of types) {
    grouped[type] = await getAllMDXMeta(type);
  }
  return grouped;
}

export async function getResourceBySlug(
  type: ResourceType,
  slug: string
): Promise<{
  mdxSource: MDXRemoteSerializeResult;
  frontmatter: ResourceFrontMatter;
} | null> {
  try {
    const response = await getMDXBySlug(type, slug);
    return response;
  } catch (e) {
    return null; // Return null if not found
  }
}