import "server-only"
import Stripe from "stripe"

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
	console.warn("Warning: STRIPE_SECRET_KEY is not configured. Stripe payments will not work.")
}

export const stripe = new Stripe(stripeKey || "sk_test_placeholder")
