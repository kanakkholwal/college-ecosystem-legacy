"use server";

import { db } from "~/db/connect";
import { embeddings as embeddingsTable } from "~/db/schema/embeddings";
import {
    NewResourceParams,
    insertResourceSchema,
    resources,
} from "~/db/schema/resources";
import { generateEmbeddings } from "~/lib/ai/embedding";

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );
    return "Resource successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};