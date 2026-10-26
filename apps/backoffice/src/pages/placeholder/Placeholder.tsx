import { ArrowLeft, Construction } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../config/navigation";
import styles from "./Placeholder.module.css";

export function Placeholder() {
	const location = useLocation();
	const item = navigation.find((entry) => entry.path === location.pathname);

	return (
		<div className={styles.page}>
			<span className={styles.eyebrow}>MINI ECOMMERCE · BACKOFFICE</span>
			<div className={styles.card}>
				<div className={styles.icon}>
					<Construction size={29} strokeWidth={1.7} />
				</div>
				<span className={styles.tag}>ĐANG PHÁT TRIỂN</span>
				<h1>{item?.label ?? "Trang quản trị"}</h1>
				<p>
					Khung trang đã sẵn sàng. Nội dung và API của mục này sẽ được
					bổ sung khi triển khai service tương ứng.
				</p>
				<Link to="/dashboard">
					<ArrowLeft size={16} /> Về tổng quan
				</Link>
			</div>
		</div>
	);
}
