import { BaseHeroSection } from "@/components/application/base-hero";
import BaseSearchBox from "@/components/application/base-search";
import ResourceCard from "@/components/application/resource-card";
import { ResponsiveContainer } from "@/components/common/container";
import { Metadata } from "next";
import { getAllResources } from "~/lib/mdx";


export const metadata: Metadata = {
    title: "Resources",
    description: "Explore our collection of articles and experiences.",
}


export default async function Page() {
  const resources = await getAllResources();

  return (
    <>
      <BaseHeroSection
        title="Resources"
        description="Explore our collection of articles and experiences."
      >
        <BaseSearchBox
          searchPlaceholder="Search resources"
          className="max-w-2xl mx-auto mb-4"
          filterDialogTitle="Filter Resources"
          filterDialogDescription="Filter resources by type, category, or tags."
          searchParamsKey="q"
          disabled={true}
          filterOptions={[
            {
              key: 'type',
              label: 'Type',
              values: [
                { value: 'article', label: 'Article' },
                { value: 'experience', label: 'Experience' },
                { value: 'misc', label: 'Miscellaneous' },
              ],
            },
            {
              key: 'category',
              label: 'Category',
              values: [
                { value: 'all', label: 'All' },
                { value: 'open-source', label: 'Open Source' },
                { value: 'career', label: 'Career' },
                { value: 'case-study', label: 'Case Study' },
              ],
            },
            {
              key: 'tags',
              label: 'Tags',
              values: [
                { value: 'all', label: 'All' },
                { value: 'web-development', label: 'Web Development' },
                { value: 'design', label: 'Design' },
                { value: 'ux-ui', label: 'UX/UI' },
              ],
            }
          ]}
        />
        </BaseHeroSection>
      <ResponsiveContainer className="px-3 lg:px-6 @5xl:grid-cols-3">
        {resources.map(frontmatter => {
          return (
            <ResourceCard key={frontmatter.slug}
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
          );
        })}
      </ResponsiveContainer>



    </>
  );
}