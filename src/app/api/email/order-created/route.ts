import { NextResponse } from "next/server";
import { sendOrderCreatedEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const to = body.to as string | undefined;
    const summary = body.summary as string | undefined;

    if (!to || !summary) {
      return NextResponse.json(
        { error: "Missing 'to' or 'summary'." },
        { status: 400 }
      );
    }

    await sendOrderCreatedEmail(to, summary);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}

