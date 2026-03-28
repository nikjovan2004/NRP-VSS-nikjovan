import { NextResponse } from "next/server";
import { sendOrderStatusEmail } from "@/lib/email";

/**
 * Pošlje stranki e-pošto ob spremembi statusa naročila (npr. ponudnik je sprejel).
 * Strežnik: nodemailer/Brevo; brez občutljivih podatkov v odgovoru.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const to = body.to as string | undefined;
    const status = body.status as string | undefined;
    const summary = body.summary as string | undefined;

    if (!to || !status || !summary) {
      return NextResponse.json(
        { error: "Missing 'to', 'status', or 'summary'." },
        { status: 400 }
      );
    }

    await sendOrderStatusEmail(to, status, summary);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
