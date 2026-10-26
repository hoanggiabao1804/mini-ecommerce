import { CreditCard, FlaskConical } from "lucide-react";
import type { DemoOutcome } from "../../../../features/checkout/types";
import styles from "./PaymentMethod.module.css";
export default function PaymentMethod({
  outcome,
  onChange,
}: {
  outcome: DemoOutcome;
  onChange: (value: DemoOutcome) => void;
}) {
  return (
    <section className={styles.section} aria-labelledby="payment-title">
      <div className={styles.heading}>
        <span>
          <CreditCard size={21} />
        </span>
        <div>
          <h2 id="payment-title">Phương thức thanh toán</h2>
          <p>Trải nghiệm luồng thanh toán trong bản dùng thử.</p>
        </div>
      </div>
      <div className={styles.method}>
        <CreditCard size={24} />
        <div>
          <strong>Thanh toán giả lập</strong>
          <p>Không thu tiền và không cần nhập thông tin thẻ.</p>
        </div>
        <span>DEMO</span>
      </div>
      <fieldset className={styles.scenario}>
        <legend>
          <FlaskConical size={15} />
          Chọn kết quả để thử giao diện
        </legend>
        <label>
          <input
            type="radio"
            name="payment-outcome"
            value="success"
            checked={outcome === "success"}
            onChange={() => onChange("success")}
          />
          Thành công
        </label>
        <label>
          <input
            type="radio"
            name="payment-outcome"
            value="failure"
            checked={outcome === "failure"}
            onChange={() => onChange("failure")}
          />
          Thất bại
        </label>
      </fieldset>
    </section>
  );
}
