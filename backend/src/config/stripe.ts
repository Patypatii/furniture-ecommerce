import Stripe from 'stripe';
import { logger } from '../utils/logger';

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  logger.warn('⚠️ Stripe secret key not found. Payment processing will be disabled.');
}

export const stripe = new Stripe(stripeKey || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

/**
 * Create payment intent
 */
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'kes',
  metadata: Record<string, any> = {}
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logger.info(`Payment intent created: ${paymentIntent.id}`);
    return paymentIntent;
  } catch (error: any) {
    logger.error('Stripe payment intent error:', error.message);
    throw new Error('Failed to create payment intent');
  }
};

/**
 * Confirm payment
 */
export const confirmPayment = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    logger.info(`Payment confirmed: ${paymentIntentId}`);
    return paymentIntent;
  } catch (error: any) {
    logger.error('Stripe payment confirmation error:', error.message);
    throw new Error('Failed to confirm payment');
  }
};

/**
 * Create refund
 */
export const createRefund = async (
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    logger.info(`Refund created: ${refund.id}`);
    return refund;
  } catch (error: any) {
    logger.error('Stripe refund error:', error.message);
    throw new Error('Failed to create refund');
  }
};

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error: any) {
    logger.error('Webhook signature verification failed:', error.message);
    throw new Error('Invalid webhook signature');
  }
};

export default stripe;

