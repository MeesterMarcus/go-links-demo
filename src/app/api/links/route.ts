import { NextResponse } from "next/server";
import { createLink, LinkConflictError, listLinks } from "@/lib/links";
import { createLinkSchema } from "@/lib/validation/link";

export async function GET() {
  return NextResponse.json({ data: await listLinks() });
}

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  try {
    const payload: unknown = await request.json();
    const parsed = createLinkSchema.safeParse(payload);
    if (!parsed.success) return NextResponse.json({ error: "Invalid shortcut", fields: parsed.error.flatten().fieldErrors, requestId }, { status: 422 });
    const link = await createLink(parsed.data);
    return NextResponse.json({ data: link, requestId }, { status: 201 });
  } catch (error) {
    if (error instanceof LinkConflictError) return NextResponse.json({ error: error.message, requestId }, { status: 409 });
    console.error("link.create.failed", { requestId, error });
    return NextResponse.json({ error: "Something went wrong", requestId }, { status: 500 });
  }
}
