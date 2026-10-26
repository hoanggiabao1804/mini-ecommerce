import { useState } from "react";
import { ImageOff } from "lucide-react";
import styles from "./ProductImage.module.css";

interface ProductImageProps {
  src: string;
  alt: string;
  eager?: boolean;
}

export default function ProductImage({
  src,
  alt,
  eager = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.frame}>
      {failed ? (
        <div className={styles.fallback}>
          <ImageOff size={38} strokeWidth={1.3} />
          <span>Chưa có hình ảnh</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
