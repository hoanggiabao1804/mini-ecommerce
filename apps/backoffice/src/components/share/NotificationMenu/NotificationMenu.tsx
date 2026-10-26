import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./NotificationMenu.module.css";

export function NotificationMenu() {
	const [open, setOpen] = useState(false);
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (!root.current?.contains(event.target as Node)) setOpen(false);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	return (
		<div className={styles.root} ref={root}>
			<button
				className={styles.trigger}
				type="button"
				aria-label="Thông báo"
				aria-expanded={open}
				aria-controls="admin-notifications"
				onClick={() => setOpen((value) => !value)}
				title="Thông báo"
			>
				<Bell size={18} />
			</button>
			{open && (
				<div
					className={styles.popover}
					id="admin-notifications"
					role="region"
					aria-label="Thông báo quản trị"
				>
					<div className={styles.heading}>
						<strong>Thông báo</strong>
						<span>Trung tâm quản trị</span>
					</div>
					<div className={styles.empty}>
						<div className={styles.emptyIcon}>
							<BellOff size={22} />
						</div>
						<strong>Chưa có thông báo</strong>
						<p>
							Thông báo về đơn hàng, tồn kho và hệ thống sẽ hiển
							thị ở đây khi dịch vụ được kết nối.
						</p>
					</div>
					<Link
						className={styles.more}
						to="/notifications"
						onClick={() => setOpen(false)}
					>
						Xem trang thông báo <ArrowUpRight size={15} />
					</Link>
				</div>
			)}
		</div>
	);
}
