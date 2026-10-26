import type { LucideIcon } from "lucide-react";
import styles from "./MetricCard.module.css";

type Props = {
	label: string;
	value: string;
	caption: string;
	icon: LucideIcon;
	tone?: "purple" | "blue" | "orange" | "green";
};

export function MetricCard({
	label,
	value,
	caption,
	icon: Icon,
	tone = "purple",
}: Props) {
	return (
		<article className={styles.card}>
			<div className={styles.top}>
				<span>{label}</span>
				<span className={`${styles.icon} ${styles[tone]}`}>
					<Icon size={19} strokeWidth={1.8} />
				</span>
			</div>
			<strong className={styles.value}>{value}</strong>
			<span className={styles.caption}>{caption}</span>
		</article>
	);
}
