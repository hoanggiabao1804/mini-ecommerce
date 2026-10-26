import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { Topbar } from "../Topbar/Topbar";
import styles from "./AdminLayout.module.css";

type Theme = "light" | "dark";

function initialTheme(): Theme {
	const saved = localStorage.getItem("backoffice-theme");
	if (saved === "light" || saved === "dark") return saved;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function AdminLayout() {
	const [theme, setTheme] = useState<Theme>(initialTheme);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem("backoffice-theme", theme);
	}, [theme]);

	return (
		<div className={styles.shell}>
			<a className="skip-link" href="#main-content">
				Chuyển đến nội dung
			</a>
			<Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
			<div className={styles.workspace}>
				<Topbar
					theme={theme}
					onToggleTheme={() =>
						setTheme((value) =>
							value === "light" ? "dark" : "light",
						)
					}
					onOpenMenu={() => setMenuOpen(true)}
				/>
				<main id="main-content" className={styles.content}>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
