import { useState } from "react";
import { ImageOff } from "lucide-react";
import styles from "./ProductThumbnail.module.css";

type Props = { src?: string; size?: "small" | "medium" };

export function ProductThumbnail({ src, size = "small" }: Props) {
	const [failed, setFailed] = useState(false);
	return (
		<span className={`${styles.thumbnail} ${styles[size]}`}>
			{src && !failed ? (
				<img
					src={src}
					alt=""
					loading="lazy"
					onError={() => setFailed(true)}
				/>
			) : (
				<ImageOff size={18} aria-label="Chưa có ảnh" />
			)}
		</span>
	);
}
