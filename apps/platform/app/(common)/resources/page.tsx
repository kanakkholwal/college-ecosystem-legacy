import { BaseHeroSection } from "@/components/application/base-hero";
import BaseSearchBox from "@/components/application/base-search";
import ResourceCard from "@/components/application/resource-card";
import { ResponsiveContainer } from "@/components/common/container";
import { Metadata } from "next";
import { getAllResources } from "~/lib/mdx";
import { appConfig } from "~/project.config";

// Site constants (should match those in your blog post page)

export const metadata: Metadata = {
  title: "Resources ",
  description: "Explore our comprehensive collection of articles, experiences, and case studies.",
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: "Resources  ",
    description: "Explore our comprehensive collection of articles, experiences, and case studies.",
    url: `${appConfig.url}/resources`,
    type: 'website',
    siteName: appConfig.name,

  },
  twitter: {
    card: 'summary_large_image',
    title: "Resources ",
    description: "Explore our comprehensive collection of articles, experiences, and case studies.",
    creator: appConfig.socials.twitter,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default async function Page() {
  const resources = await getAllResources();

  // Structured data for CollectionPage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Resources",
    "description": "Explore our comprehensive collection of articles, experiences, and case studies.",
    "url": `${appConfig.url}/resources`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": resources.map((resource, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": resource.type === 'articles' ? 'Article' : 'CreativeWork',
          "name": resource.title,
          "url": `${appConfig.url}/resources/${resource.type}/${resource.slug}`,
          "description": resource.summary,
          "datePublished": new Date(resource.date).toISOString(),
          "image": resource.coverImage ? {
            "@type": "ImageObject",
            "url": resource.coverImage
          } : undefined,
          "articleSection": resource.category,
          "keywords": resource.tags?.join(', ') || '',
        }
      }))
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <BaseHeroSection
        title="Resources"
        description="Explore our comprehensive collection of articles, experiences, and case studies."
      >
        <BaseSearchBox
          searchPlaceholder="Search resources..."
          className="max-w-2xl mx-auto mb-4"
          filterDialogTitle="Filter Resources"
          filterDialogDescription="Filter resources by type, category, or tags to find exactly what you need."
          searchParamsKey="q"
          disabled={true}
          filterOptions={[
            {
              key: 'type',
              label: 'Type',
              values: [
                { value: 'article', label: 'Articles' },
                { value: 'experience', label: 'Experiences' },
                { value: 'misc', label: 'Miscellaneous' },
              ],
            },
            {
              key: 'category',
              label: 'Category',
              values: [
                { value: 'all', label: 'All Categories' },
                { value: 'open-source', label: 'Open Source' },
                { value: 'career', label: 'Career Development' },
                { value: 'case-study', label: 'Case Studies' },
              ],
            },
            {
              key: 'tags',
              label: 'Tags',
              values: [
                { value: 'all', label: 'All Tags' },
                { value: 'web-development', label: 'Web Development' },
                { value: 'design', label: 'Design' },
                { value: 'ux-ui', label: 'UX/UI Design' },
              ],
            }
          ]}
        />
      </BaseHeroSection>

      <ResponsiveContainer 
        className="px-3 pr-4 lg:px-6 @md:grid-cols-1 @5xl:grid-cols-3"
        role="list"
        aria-label="List of resources"
      >
        {resources.map((frontmatter, index) => (
          <div key={frontmatter.slug} role="listitem">
            <ResourceCard
              type={frontmatter.type || 'misc'}
              title={frontmatter.title}
              slug={frontmatter.slug}
              summary={frontmatter.summary}
              tags={frontmatter.tags}
              coverImage={frontmatter.coverImage}
              date={frontmatter.date}
              readingTime={frontmatter.readingTime}
              category={frontmatter.category}
            />
          </div>
        ))}
      </ResponsiveContainer>
    </>
  );
}