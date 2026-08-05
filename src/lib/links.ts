import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateLinkInput } from "@/lib/validation/link";

export const listLinks = () => prisma.link.findMany({ orderBy: { createdAt: "desc" } });

export async function createLink(input: CreateLinkInput) {
  try {
    return await prisma.link.create({ data: { ...input, description: input.description || null } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new LinkConflictError(input.slug);
    throw error;
  }
}

export const resolveLink = (slug: string) => prisma.link.update({ where: { slug }, data: { visits: { increment: 1 } } });

export class LinkConflictError extends Error {
  constructor(slug: string) {
    super(`go/${slug} already exists`);
    this.name = "LinkConflictError";
  }
}
