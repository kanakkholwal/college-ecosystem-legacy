import { z } from "zod";
import { appConfig } from "~/project.config";

export const clubCategories = [
    'Technical',
    'Cultural',
    'Literary',
    'Sports',
    'Social Service',
    'Academic',
    'Arts & Crafts'
] as const;

const restrictedSubDomains = [
    'admin',
    'moderator',
    'support',
    'contact',
    'help',
    'about',
    'terms',
    'privacy',
    'legal',
    'policy',
    'feedback',
    'careers',
    'jobs',
    'team',
    'developers',
    'api',
    'docs',
    'blog',
    'news',
    'events',
    'forum',
    'community',
    'resources',
    'gallery',
    'shop',
    'store',
    'services',
    'products',
    'partners',
    'affiliate',
    ...appConfig.otherAppDomains.map(domain => domain.split('.')[0]), // Extract subdomains from other app domains
    appConfig.appDomain.split('.')[0], // Extract subdomain from main app domain
];

export const clubSchema = z.object({
    name: z.string().min(1, { message: "Club name is required" }).describe("The name of the club"),
    tagline: z.string().min(1, { message: "Club tagline is required" }),
    description: z.string().min(1, { message: "Club description is required" }).max(500, { message: "Club description must be less than 500 characters" }),
    establishedYear: z.string().min(4, { message: "Established year must be at least 4 characters" }).max(4, { message: "Established year must be exactly 4 characters" }),
    logo: z.string().url({ message: "Logo must be a valid URL" }),
    
    type: z.enum(['public', 'private'], {
        message: "Club type must be either 'public' or 'private'",
    }).default('public'),
    club_type: z.enum(['society', 'club'], {
        message: "Club type must be either 'society' or 'club'",
    }).default('club').optional(),
    operationAs: z.enum(['online', 'offline', 'hybrid'], {
        message: "Club operation type must be either 'online', 'offline', or 'hybrid'",
    }).default('offline'),
    operationSpan: z.enum(['semester', 'year'], {
        message: "Club operation span must be either 'semester' or 'year'",
    }).default('semester'),
    category: z.enum(clubCategories, {
        message: "Invalid club category",
    }),
    members: z.array(z.string().min(1, { message: "Member ID is required" })),
    tags: z.array(z.string().min(1, { message: "Tag cannot be empty" })).optional().default([]),

    isVerified: z.boolean().default(false),
    clubEmail: z.string().email({ message: "Invalid club email" }),
    isClubEmailVerified: z.boolean().default(false),

    subDomain: z.string()
    .min(1, { message: "Subdomain is required" })
    .refine((val) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(val), {
        message: "Subdomain must be lowercase alphanumeric with optional hyphens",
    })
    .refine((val) => !restrictedSubDomains.includes(val), {
        message: "Subdomain is not allowed",
    }),
    customDomain: z.string().url({ message: "Custom domain must be a valid URL" }).optional(),

    theme: z.object({
        primaryColor: z.string().min(1, { message: "Primary color is required" }),
        secondaryColor: z.string().min(1, { message: "Secondary color is required" }),
        territoryColor: z.string().min(1, { message: "Tertiary color is required" }).optional(),
        backgroundColor: z.string().min(1, { message: "Background color is required" }).optional(),
        textColor: z.string().min(1, { message: "Text color is required" }).optional(),
    }).optional(),

    president: z.object({
        name: z.string().min(1, { message: "President name is required" }),
        email: z.string().email({ message: "Invalid president email" }),
        phoneNumber: z.string().optional(),
    }),
});

export type ClubSchemaType = z.infer<typeof clubSchema>;
