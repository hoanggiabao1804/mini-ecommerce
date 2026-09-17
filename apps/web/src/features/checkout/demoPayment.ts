import type { CheckoutSnapshot, DemoOutcome, DemoReceipt } from "./types";
// Replace this adapter with an API call when the payment flow is implemented.
// It never sends requests, collects card details, or creates real orders/payments.
export function simulatePayment(
  snapshot: CheckoutSnapshot,
  outcome: DemoOutcome,
  signal: AbortSignal,
): Promise<DemoReceipt> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Cancelled", "AbortError"));
      return;
    }
    const cancel = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve({
        ...structuredClone(snapshot),
        outcome,
        reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      });
    }, 1000);
    signal.addEventListener("abort", cancel, { once: true });
  });
}
