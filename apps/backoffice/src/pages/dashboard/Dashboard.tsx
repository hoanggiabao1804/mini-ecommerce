import { useEffect, useState } from "react";
import {
	ArrowRight,
	Boxes,
	ChartNoAxesCombined,
	Clock3,
	PackageCheck,
	ShoppingBag,
	Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { listProducts } from "../../api/products";
import { MetricCard } from "./components/MetricCard/MetricCard";
import styles from "./Dashboard.module.css";

export function Dashboard() {
	const [productCount, setProductCount] = useState<number | null>(null);
	const [catalogError, setCatalogError] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		listProducts({ page: 1, limit: 1 }, controller.signal)
			.then((result) => setProductCount(result.meta.total))
			.catch(() => {
				if (!controller.signal.aborted) setCatalogError(true);
			});
		return () => controller.abort();
	}, []);

	return (
		<div className={styles.page}>
			<div className={styles.heading}>
				<div>
					<span className={styles.eyebrow}>BẢNG ĐIỀU KHIỂN</span>
					<h1>
						Tổng quan cửa hàng<span>.</span>
					</h1>
					<p>
						Theo dõi hoạt động và truy cập nhanh những khu vực quan
						trọng.
					</p>
				</div>
				<span className={styles.tag}>
					<span /> Admin workspace
				</span>
			</div>
			<section
				className={styles.welcome}
				aria-label="Giới thiệu bảng điều khiển"
			>
				<div className={styles.welcomeCopy}>
					<span className={styles.welcomeKicker}>
						MINI ECOMMERCE · BACKOFFICE
					</span>
					<h2>
						Mọi thứ bạn cần để
						<br />
						quản lý cửa hàng.
					</h2>
					<p>
						Bắt đầu với danh mục sản phẩm. Những chỉ số từ đơn hàng,
						thanh toán và người dùng sẽ xuất hiện khi các dịch vụ
						được kết nối.
					</p>
					<Link to="/products">
						Đi tới sản phẩm <ArrowRight size={17} />
					</Link>
				</div>
				<div className={styles.welcomeArt} aria-hidden="true">
					<div className={styles.orbit}>
						<div className={styles.artCenter}>
							<Boxes size={39} strokeWidth={1.45} />
						</div>
						<span className={styles.orbitOne}>
							<ShoppingBag size={21} />
						</span>
						<span className={styles.orbitTwo}>
							<ChartNoAxesCombined size={21} />
						</span>
						<span className={styles.orbitThree}>
							<Users size={21} />
						</span>
					</div>
				</div>
			</section>
			<div className={styles.sectionHeading}>
				<div>
					<h2>Chỉ số tổng quan</h2>
					<p>Dữ liệu trực tiếp sẽ được cập nhật theo từng service.</p>
				</div>
				<span>4 CHỈ SỐ</span>
			</div>
			<div className={styles.metrics}>
				<MetricCard
					label="Sản phẩm đang hiển thị"
					value={
						catalogError
							? "—"
							: productCount === null
								? "…"
								: productCount.toLocaleString("vi-VN")
					}
					caption={
						catalogError
							? "Không thể kết nối Product Service"
							: "Từ Product Service"
					}
					icon={PackageCheck}
				/>
				<MetricCard
					label="Đơn hàng"
					value="—"
					caption="Chờ kết nối Order Service"
					icon={ShoppingBag}
					tone="blue"
				/>
				<MetricCard
					label="Doanh thu"
					value="—"
					caption="Chờ kết nối Payment Service"
					icon={ChartNoAxesCombined}
					tone="orange"
				/>
				<MetricCard
					label="Người dùng"
					value="—"
					caption="Chờ kết nối Auth/User Service"
					icon={Users}
					tone="green"
				/>
			</div>
			<div className={styles.lowerGrid}>
				<section className={styles.panel}>
					<div className={styles.panelTop}>
						<div>
							<span className={styles.panelEyebrow}>
								TRUY CẬP NHANH
							</span>
							<h2>Quản lý công việc</h2>
						</div>
						<Clock3 size={19} />
					</div>
					<Link to="/products" className={styles.quickLink}>
						<span className={styles.quickIcon}>
							<Boxes size={21} />
						</span>
						<span>
							<strong>Danh mục sản phẩm</strong>
							<small>Xem sản phẩm, cấu hình và các SKU</small>
						</span>
						<ArrowRight size={18} />
					</Link>
					<Link to="/inventory" className={styles.quickLink}>
						<span className={styles.quickIcon}>
							<PackageCheck size={21} />
						</span>
						<span>
							<strong>Quản lý tồn kho</strong>
							<small>Sẽ kết nối Inventory Service</small>
						</span>
						<ArrowRight size={18} />
					</Link>
					<Link to="/orders" className={styles.quickLink}>
						<span className={styles.quickIcon}>
							<ShoppingBag size={21} />
						</span>
						<span>
							<strong>Đơn hàng</strong>
							<small>Sẽ kết nối Order Service</small>
						</span>
						<ArrowRight size={18} />
					</Link>
				</section>
				<section className={styles.panel}>
					<div className={styles.panelTop}>
						<div>
							<span className={styles.panelEyebrow}>
								HOẠT ĐỘNG
							</span>
							<h2>Cập nhật gần đây</h2>
						</div>
						<span className={styles.liveTag}>SẮP CÓ</span>
					</div>
					<div className={styles.emptyActivity}>
						<span>
							<Clock3 size={26} />
						</span>
						<strong>Chưa có dữ liệu hoạt động</strong>
						<p>
							Đơn hàng, sự kiện hệ thống và thông báo sẽ xuất hiện
							tại đây sau khi kết nối các dịch vụ tương ứng.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
