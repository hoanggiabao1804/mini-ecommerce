import { type ReactNode } from "react";
import styles from "./FormField.module.css";
export default function FormField({
  id,
  label,
  error,
  hint,
  children,
  wide = false,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <label htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
