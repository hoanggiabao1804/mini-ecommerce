import { Menu, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { navigation } from "../../../config/navigation";
import { NotificationMenu } from "../NotificationMenu/NotificationMenu";
import styles from "./Topbar.module.css";

type Props = {
	theme: "light" | "dark";
	onToggleTheme: () => void;
	onOpenMenu: () => void;
};

export function Topbar({ theme, onToggleTheme, onOpenMenu }: Props) {
	const location = useLocation();
	const current = navigation.find((item) => item.path === location.pathname);

	return (
		<header className={styles.topbar}>
			<div className={styles.left}>
				<button
					className={styles.mobileMenu}
					type="button"
					aria-label="Mở menu"
					onClick={onOpenMenu}
				>
					<Menu size={21} />
				</button>
				<div className={styles.breadcrumb}>
					<span>Workspace</span>
					<span className={styles.separator}>/</span>
					<strong>{current?.label ?? "Quản trị"}</strong>
				</div>
			</div>
			<div className={styles.actions}>
				<span className={styles.workspaceLabel}>MINI ECOMMERCE</span>
				<span className={styles.divider} />
				<button
					type="button"
					className={styles.iconButton}
					onClick={onToggleTheme}
					aria-label={
						theme === "light"
							? "Bật giao diện tối"
							: "Bật giao diện sáng"
					}
					title={
						theme === "light" ? "Giao diện tối" : "Giao diện sáng"
					}
				>
					{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
				</button>
				<NotificationMenu />
				<div
					className={styles.avatar}
					aria-label="Giao diện quản trị bản demo"
				>
					AD
				</div>
			</div>
		</header>
	);
}
