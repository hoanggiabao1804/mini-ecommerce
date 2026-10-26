import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./PasswordInput.module.css";
export default function PasswordInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.wrapper}>
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={`${visible ? "Ẩn" : "Hiện"} ${props.id === "confirmPassword" ? "mật khẩu xác nhận" : "mật khẩu"}`}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
