import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { useCart } from "../../features/cart/useCart";
import { findProduct } from "../../features/catalog/catalog";
import {
  validateAddress,
  focusFirstError,
  type FormErrors,
} from "../../features/auth/validation";
import { simulatePayment } from "../../features/checkout/demoPayment";
import type {
  DeliveryInfo,
  DemoOutcome,
  DemoReceipt,
} from "../../features/checkout/types";
import DeliveryForm from "./components/DeliveryForm/DeliveryForm";
import PaymentMethod from "./components/PaymentMethod/PaymentMethod";
import OrderSummary from "./components/OrderSummary/OrderSummary";
import CheckoutResult from "./components/CheckoutResult/CheckoutResult";
import { useNotifications } from "../../features/notifications/useNotifications";
import styles from "./Checkout.module.css";
export default function Checkout() {
  const { user } = useAuth();
  const { notifyPayment } = useNotifications();
  const { lines, total, completePurchase } = useCart();
  const defaultAddress =
    user?.addresses.find((address) => address.isDefault) ?? user?.addresses[0];
  const [selectedAddress, setSelectedAddress] = useState(
    defaultAddress?.id ?? "new",
  );
  const [delivery, setDelivery] = useState<DeliveryInfo>(() => ({
    recipient: defaultAddress?.recipient ?? user?.fullName ?? "",
    phone: defaultAddress?.phone ?? user?.phone ?? "",
    email: user?.email ?? "",
    street: defaultAddress?.street ?? user?.address ?? "",
    city: defaultAddress?.city ?? "",
    note: "",
  }));
  const [outcome, setOutcome] = useState<DemoOutcome>("success");
  const [errors, setErrors] = useState<FormErrors>({});
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState<DemoReceipt | null>(null);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      request.current?.abort();
    },
    [],
  );
  const items = lines.flatMap((line) => {
    const product = findProduct(line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  function selectAddress(id: string) {
    setSelectedAddress(id);
    setErrors({});
    const address = user?.addresses.find((item) => item.id === id);
    setDelivery((current) => ({
      ...current,
      recipient: address?.recipient ?? user?.fullName ?? "",
      phone: address?.phone ?? user?.phone ?? "",
      street: address?.street ?? "",
      city: address?.city ?? "",
    }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || !items.length) return;
    const next = validateAddress({
      ...delivery,
      label: "Giao hàng",
      isDefault: false,
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.email.trim()))
      next.email = "Vui lòng nhập email hợp lệ.";
    setErrors(next);
    setError("");
    if (Object.keys(next).length) {
      focusFirstError(next);
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    const submittedLines = lines.map((line) => ({ ...line }));
    const snapshot = {
      items,
      total,
      delivery: {
        ...delivery,
        recipient: delivery.recipient.trim(),
        phone: delivery.phone.trim(),
        email: delivery.email.trim(),
        street: delivery.street.trim(),
        city: delivery.city.trim(),
        note: delivery.note.trim(),
      },
    };
    try {
      const result = await simulatePayment(
        snapshot,
        outcome,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setReceipt(result);
      notifyPayment(result);
      if (result.outcome === "success") completePurchase(submittedLines);
      window.scrollTo({ top: 0 });
    } catch (error) {
      if (!controller.signal.aborted)
        setError(
          error instanceof Error
            ? error.message
            : "Chưa thể hoàn tất thanh toán demo. Vui lòng thử lại.",
        );
    } finally {
      if (!controller.signal.aborted) {
        request.current = null;
        setPending(false);
      }
    }
  }
  return (
    <main id="main-content" className={styles.page}>
      <nav className={styles.steps} aria-label="Tiến trình mua hàng">
        <Link to="/cart">1. Giỏ hàng</Link>
        <ChevronRight size={14} />
        <span
          aria-current={
            !receipt || receipt.outcome === "failure" ? "step" : undefined
          }
        >
          2. Thanh toán
        </span>
        <ChevronRight size={14} />
        <span
          aria-current={receipt?.outcome === "success" ? "step" : undefined}
        >
          3. Hoàn tất
        </span>
      </nav>
      {receipt ? (
        <CheckoutResult
          receipt={receipt}
          onRetry={() => {
            setReceipt(null);
            setError("");
          }}
        />
      ) : !items.length ? (
        <section className={styles.empty}>
          <ShoppingBag size={45} strokeWidth={1.3} />
          <h1>Chưa có sản phẩm để thanh toán</h1>
          <p>Thêm thiết bị yêu thích vào giỏ để bắt đầu.</p>
          <Link to="/#products">Khám phá sản phẩm</Link>
        </section>
      ) : (
        <>
          <Link to="/cart" className={styles.back}>
            <ArrowLeft size={16} />
            Quay lại giỏ hàng
          </Link>
          <div className={styles.heading}>
            <span>CHỈ CÒN MỘT BƯỚC NỮA</span>
            <h1>Thanh toán</h1>
            <p>
              Kiểm tra thông tin nhận hàng và hoàn tất trải nghiệm mua sắm demo.
            </p>
          </div>
          <div className={styles.layout}>
            <form id="checkout-form" noValidate onSubmit={submit}>
              <fieldset disabled={pending} className={styles.fields}>
                <DeliveryForm
                  values={delivery}
                  onChange={(next) => {
                    setDelivery(next);
                    if (
                      next.recipient !== delivery.recipient ||
                      next.phone !== delivery.phone ||
                      next.street !== delivery.street ||
                      next.city !== delivery.city
                    )
                      setSelectedAddress("new");
                  }}
                  errors={errors}
                  selectedAddress={selectedAddress}
                  onSelect={selectAddress}
                />
                <PaymentMethod outcome={outcome} onChange={setOutcome} />
              </fieldset>
              {error && (
                <p role="alert" className={styles.error}>
                  {error}
                </p>
              )}
            </form>
            <OrderSummary items={items} total={total} pending={pending} />
          </div>
        </>
      )}
    </main>
  );
}
