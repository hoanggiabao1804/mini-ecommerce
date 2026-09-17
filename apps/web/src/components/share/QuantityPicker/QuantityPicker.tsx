import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "../../../features/cart/cart";
import styles from "./QuantityPicker.module.css";
export default function QuantityPicker({
  value,
  onChange,
  label = "Số lượng",
  max = MAX_QUANTITY,
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  max?: number;
}) {
  return (
    <div className={styles.picker} role="group" aria-label={label}>
      <button
        type="button"
        aria-label={`Giảm ${label.toLowerCase()}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <input
        key={value}
        type="number"
        aria-label={label}
        min={1}
        max={max}
        step={1}
        defaultValue={value}
        inputMode="numeric"
        onBlur={(event) => {
          const next = Number(event.target.value);
          if (Number.isInteger(next) && next >= 1 && next <= max)
            onChange(next);
          else event.target.value = String(value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
      <button
        type="button"
        aria-label={`Tăng ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
