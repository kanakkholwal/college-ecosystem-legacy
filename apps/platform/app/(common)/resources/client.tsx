"use client"
import ResourceCard from '@/components/application/resource-card'
import { ResponsiveContainer } from '@/components/common/container'
import { Button } from '@/components/ui/button'
import { parseAsStringEnum, useQueryState } from 'nuqs'
import { ResourceFrontMatter } from '~/lib/mdx'


export function CategoryFilter({ categories }: { categories: string[] }) {
    const [category, setCategory] = useQueryState('category', parseAsStringEnum(categories))
    return (
        <div className='flex flex-wrap gap-2 mb-4'>

            {["", ...categories].map((cat, index) => (
                <Button
                    key={`category-${index}`}
                    variant={category === cat ? "default_light" : "outline"}
                    onClick={() => setCategory(cat)}
                    rounded="full"
                    size="sm"
                >
                    {cat || "All Categories"}
                </Button>
            ))}

        </div>
    )
}

export function ResourcesList({ resources }: { resources: ResourceFrontMatter[] }) {
    const [category, _] = useQueryState('category', parseAsStringEnum(resources.map(r => r.category || '')))

    return (<ResponsiveContainer
        className="px-3 pr-4 lg:px-6 @md:grid-cols-1 @5xl:grid-cols-3"
        role="list"
        aria-label="List of resources"
    >
        {resources
        .filter((frontmatter) =>  {
            if (!category || category === '') return true
            return frontmatter.category?.toLowerCase() === category.toLowerCase()
        })
        .map((frontmatter) => (
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
    </ResponsiveContainer>)
}