import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/utils/link';
import { ArrowLeftIcon } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllResourcesGroupedByType, getResourceBySlug, ResourceType } from '~/lib/mdx';
import { appConfig } from '~/project.config';
import { changeCase } from '~/utils/string';
import { ClientMdx } from './client';


type PageProps = {
    params: Promise<{ type: ResourceType; slug: string }>;
};

export async function generateStaticParams() {
    const meta = await getAllResourcesGroupedByType();
    return Object.entries(meta).flatMap(([type, resources]) => {
        return resources.map(resource => ({
            type,
            slug: resource.slug,
        }));
    });
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const resourceMeta = await getResourceBySlug(resolvedParams.type, resolvedParams.slug);
    if (!resourceMeta) notFound();

    const { frontmatter } = resourceMeta;

    const title = `${frontmatter.title} • ${changeCase(resolvedParams.type, "title")} • ${(await parent).title}`;
    const description = frontmatter.summary || "Explore our resources";
    const resourceUrl = `${appConfig.url}/resources/${resolvedParams.type}/${resolvedParams.slug}`;
    return {
        title,
        description,
        alternates: {
            canonical: resourceUrl,
        },
        openGraph: {
            title,
            description,
            url: resourceUrl,
            type: 'article',
            publishedTime: new Date(frontmatter.date).toISOString(),
            modifiedTime: new Date(frontmatter.updated || frontmatter.date).toISOString(),
            //   authors: frontmatter.author ? [frontmatter.author] : [],
            section: frontmatter.category,
            images: []
        },
        twitter: {
            card: 'summary',
            title,
            description,
            creator: appConfig.socials.twitter,
            images: [],
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
}

export default async function ResourcePage({ params }: PageProps) {
    const resolvedParams = await params;
    const response = await getResourceBySlug(resolvedParams.type, resolvedParams.slug);
    if (!response) notFound();

    const { mdxSource, frontmatter } = response;
    const resourceUrl = `${appConfig.url}/resources/${resolvedParams.type}/${resolvedParams.slug}`;
    const publishedDate = new Date(frontmatter.date).toISOString();
    const modifiedDate = new Date(frontmatter.updated || frontmatter.date).toISOString();

    // Structured data for BlogPosting
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": frontmatter.title,
        "description": frontmatter.summary || "Explore our resources",
        "url": resourceUrl,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": resourceUrl
        },
        "datePublished": publishedDate,
        "dateModified": modifiedDate,
        "author": frontmatter.author ? {
            "@type": "Person",
            "name": frontmatter.author
        } : {
            "@type": "Organization",
            "name": appConfig.name
        },
        "publisher": {
            "@type": "Organization",
            "name": appConfig.name,
            "logo": {
                "@type": "ImageObject",
                "url": `${appConfig.url}/logo.png`
            }
        },
        "articleSection": frontmatter.category,
        "keywords": frontmatter.tags?.join(', ') || '',
        // "image": frontmatter.image ? {
        //     "@type": "ImageObject",
        //     "url": frontmatter.image
        // } : undefined
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                id='structured-data-resource'
            />

            <main className="max-w-6xl mx-auto" itemType="https://schema.org/BlogPosting" itemScope>
                <ButtonLink
                    href={`/resources/${resolvedParams.type}`}
                    variant="ghost"
                    size="sm"
                    className="m-4"
                    aria-label={`Back to ${changeCase(resolvedParams.type, "title")} resources`}
                >
                    <ArrowLeftIcon />
                    Back to {changeCase(resolvedParams.type, "title")}
                </ButtonLink>

                <div className='text-center mb-4 space-y-5 py-8 px-3 lg:px-0'>
                    <h1 className="text-xl lg:text-3xl font-semibold mx-auto max-w-5xl" itemProp="headline">
                        {frontmatter.title}
                    </h1>

                    <p className="text-muted-foreground text-base mb-3 line-clamp-3 max-w-3xl mx-auto" itemProp="abstract">
                        {frontmatter.summary}
                    </p>

                    <div className="text-sm text-muted-foreground">
                        <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                            <meta itemProp="name" content={appConfig.name} />
                        </span>

                        Published under
                        <Badge size="sm" className='px-1 mx-1' itemProp="articleSection">
                            {frontmatter.category}
                        </Badge>
                        on
                        <Badge size="sm" className='px-1 mx-1' itemProp="datePublished" content={publishedDate}>
                            {new Date(frontmatter.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Badge>
                    </div>
                </div>

                <article
                    className="prose mx-auto p-6 dark:prose-invert prose-sm max-w-3xl bg-card rounded-lg"
                    itemProp="articleBody"
                >
                    <ClientMdx mdxSource={mdxSource} />
                </article>

                <div className="flex justify-between mt-8 px-2 pr-3 max-w-3xl mx-auto ">
                    <div className="text-xs text-muted-foreground bg-card p-2 rounded-lg">
                        Last updated on <br />
                        <p
                            className="inline-block px-1 mx-1 text-base font-semibold text-foreground"
                            itemProp="dateModified"
                            content={modifiedDate}
                        >
                            {new Date(frontmatter.updated || frontmatter.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}