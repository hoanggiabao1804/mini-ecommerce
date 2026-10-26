import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { navigation, sections } from "../../../config/navigation";
import styles from "./Sidebar.module.css";

type Props = { open: boolean; onClose: () => void };

export function Sidebar({ open, onClose }: Props) {
	return (
		<>
			{open && (
				<button
					type="button"
					aria-label="Đóng menu"
					className={styles.backdrop}
					onClick={onClose}
				/>
			)}
			<aside
				className={`${styles.sidebar} ${open ? styles.open : ""}`}
				aria-label="Điều hướng quản trị"
			>
				<Link
					className={styles.brand}
					to="/dashboard"
					title="Tổng quan"
				>
					<img src="/logo.png" alt="" />
					<div>
						<strong>
							mini<span>ecommerce</span>
						</strong>
						<small>ADMIN WORKSPACE</small>
					</div>
					<button
						type="button"
						className={styles.close}
						aria-label="Đóng menu"
						onClick={onClose}
					>
						<X size={19} />
					</button>
				</Link>
				<div className={styles.environment}>
					<span className={styles.pulse} /> Không gian quản trị{" "}
					<ChevronRight size={15} />
				</div>
				<nav className={styles.nav}>
					{sections.map((section) => (
						<div className={styles.group} key={section.label}>
							<p className={styles.groupTitle}>{section.label}</p>
							{section.paths.map((path) => {
								const item = navigation.find(
									(entry) => entry.path === path,
								)!;
								const Icon = item.icon;
								return (
									<NavLink
										key={path}
										to={path}
										onClick={onClose}
										className={({ isActive }) =>
											`${styles.link} ${isActive ? styles.active : ""}`
										}
									>
										<Icon size={18} strokeWidth={1.9} />
										<span>{item.label}</span>
										{!item.ready && (
											<span
												className={styles.soon}
												aria-label="Sắp có"
											>
												Sau
											</span>
										)}
									</NavLink>
								);
							})}
						</div>
					))}
				</nav>
				<div className={styles.sidebarFoot}>
					<div className={styles.supportIcon}>
						<ChevronLeft size={17} />
					</div>
					<div>
						<strong>Quản lý dễ dàng hơn</strong>
						<span>Các module sẽ được mở dần</span>
					</div>
				</div>
			</aside>
		</>
	);
}
