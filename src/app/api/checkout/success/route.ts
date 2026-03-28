import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * POST body: { session_id: string }
 * Returns: { orderId: string } so the client can mark the order as paid.
 * Server does not touch Firestore (client will call updateOrderStatus from success page).
 */
export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }

  let body: { session_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const sessionId = body.session_id;
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "Missing session_id." },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return NextResponse.json(
        { error: "Session has no orderId in metadata." },
        { status: 400 }
      );
    }
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed." },
        { status: 400 }
      );
    }
    return NextResponse.json({ orderId });
  } catch (err) {
    console.error("Stripe session retrieve error:", err);
    return NextResponse.json(
      { error: "Failed to verify session." },
      { status: 500 }
    );
  }
}
