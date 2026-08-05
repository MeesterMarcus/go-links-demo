import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { resolveLink } from "@/lib/links";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const link = await resolveLink(slug);
    redirect(link.destination);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") redirect(`/?missing=${encodeURIComponent(slug)}`);
    throw error;
  }
}
