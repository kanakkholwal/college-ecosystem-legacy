import { applicationSchema } from '@/lib/validation';
import { Client } from "@notionhq/client";
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = applicationSchema.safeParse(body);
        if (!response.success) {
            return NextResponse.json(
                { error: response.error.errors.map(err => err.message) },
                { status: 400 }
            );
        }
        const validated = response.data;

        await notion.pages.create({
            parent: { database_id: process.env.NOTION_DATABASE_ID! },
            properties: {
                Name: { title: [{ text: { content: validated.name } }] },
                Email: { email: validated.collegeId },
                Year: { select: { name: validated.collegeYear } },
                'Work Links': {
                    rich_text: validated.workLinks.map(link => ({
                        text: { content: link, link: { url: link } }
                    }))
                },
                'Best Project': {
                    rich_text: [{ text: { content: validated.bestProject ?? "" } }]
                },
                'Best Hack': {
                    rich_text: [{ text: { content: validated.bestHack ?? "" } }]
                },
                Status: { select: { name: "Applied" } }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Submission failed" },
            { status: 500 }
        );
    }
}