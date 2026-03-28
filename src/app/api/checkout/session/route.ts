import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." },
      { status: 500 }
    );
  }

  let body: { orderId: string; amount: number; currency?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { orderId, amount, currency = "eur" } = body;
  if (!orderId || typeof amount !== "number" || amount < 1) {
    return NextResponse.json(
      { error: "Missing or invalid orderId or amount (positive number in cents)." },
      { status: 400 }
    );
  }

  const successUrl =
    process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL ||
    "http://localhost:3000/checkout/success";
  const cancelUrl =
    process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL ||
    "http://localhost:3000/checkout/cancel";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: { orderId },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(amount),
            product_data: {
              name: "DomServices naročilo",
              description: `Naročilo #${orderId}`,
            },
          },
        },
      ],
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
