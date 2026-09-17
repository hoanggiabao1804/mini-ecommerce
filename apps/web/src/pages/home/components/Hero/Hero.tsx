import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	ArrowUpRight,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import styles from "./Hero.module.css";
const slides = [
	{
		eyebrow: "BỘ SƯU TẬP ĐIỆN THOẠI",
		title: (
			<>
				Chạm công nghệ.
				<br />
				Mở chất riêng.
			</>
		),
		description:
			"Thiết kế tinh tế, hiệu năng ấn tượng.\nTìm chiếc điện thoại dành riêng cho bạn.",
		image: "/images/products/iphone.png",
		alt: "iPhone 16",
		category: "phone",
		label: "Khám phá điện thoại",
	},
	{
		eyebrow: "KHÔNG GIAN LÀM VIỆC MỚI",
		title: (
			<>
				Gọn nhẹ bên bạn.
				<br />
				Sẵn sàng bứt phá.
			</>
		),
		description:
			"Từ ý tưởng đầu tiên đến dự án tiếp theo.\nTìm người bạn đồng hành mỗi ngày.",
		image: "/images/products/macbook.jpg",
		alt: "MacBook Air M3",
		category: "laptop",
		label: "Khám phá laptop",
	},
	{
		eyebrow: "ÂM THANH THEO CÁCH CỦA BẠN",
		title: (
			<>
				Bật giai điệu.
				<br />
				Chạm cảm hứng.
			</>
		),
		description:
			"Một chút nhạc cho những ngày bận rộn.\nKhám phá thế giới âm thanh của bạn.",
		image: "/images/products/airpods.png",
		alt: "AirPods Pro 2",
		category: "audio",
		label: "Khám phá âm thanh",
	},
];
export default function Hero() {
	const [active, setActive] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActive((prev) => (prev + 1) % slides.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [active]);

	return (
		<section className={styles.hero} aria-label="Bộ sưu tập nổi bật">
			<div className={styles.feature} aria-roledescription="carousel">
				<div
					className={styles.track}
					style={{ transform: `translateX(-${active * 100}%)` }}
				>
					{slides.map((slide, index) => (
						<div
							className={styles.slide}
							key={slide.category}
							aria-hidden={active !== index} // Ẩn khỏi Screen Reader nếu không active
						>
							<div className={styles.copy}>
								<span className={styles.eyebrow}>
									<span />
									{slide.eyebrow}
								</span>
								<h1>{slide.title}</h1>
								<p>{slide.description}</p>
								<Link
									to={`/?category=${slide.category}#products`}
									className={styles.cta}
									tabIndex={active === index ? 0 : -1} // Chặn tab phím vào slide ẩn
								>
									{slide.label}
									<ArrowRight size={17} />
								</Link>
							</div>
							<div className={styles.art}>
								<span className={styles.orbit} />
								<img
									src={slide.image}
									alt={slide.alt}
									fetchPriority={
										index === 0 ? "high" : "auto"
									}
								/>
								<span className={styles.artLabel}>
									YOUR NEXT FAVORITE.
								</span>
							</div>
						</div>
					))}
				</div>
				<div className={styles.controls}>
					<div className={styles.dots}>
						{slides.map((item, index) => (
							<button
								key={item.category}
								type="button"
								aria-label={`Xem banner ${index + 1}: ${item.alt}`}
								aria-pressed={active === index}
								className={
									active === index
										? styles.selected
										: undefined
								}
								onClick={() => setActive(index)}
							/>
						))}
					</div>
					<div className={styles.arrows}>
						<button
							type="button"
							aria-label="Banner trước"
							onClick={() =>
								setActive(
									(active + slides.length - 1) %
										slides.length,
								)
							}
						>
							<ChevronLeft size={17} />
						</button>
						<button
							type="button"
							aria-label="Banner tiếp theo"
							onClick={() =>
								setActive((active + 1) % slides.length)
							}
						>
							<ChevronRight size={17} />
						</button>
					</div>
				</div>
			</div>
			<div className={styles.side}>
				<Link to="/?category=laptop#products" className={styles.laptop}>
					<div>
						<span>LÀM VIỆC & SÁNG TẠO</span>
						<h2>
							Mỏng nhẹ.
							<br />
							Mạnh mẽ.
						</h2>
						<span className={styles.sideLink}>
							Khám phá laptop <ArrowUpRight size={15} />
						</span>
					</div>
					<img src="/images/products/macbook.jpg" alt="MacBook Air" />
				</Link>
				<Link to="/?category=audio#products" className={styles.audio}>
					<div>
						<span>THẾ GIỚI ÂM THANH</span>
						<h2>
							Giai điệu hay.
							<br />
							Mỗi ngày.
						</h2>
						<span className={styles.sideLink}>
							Khám phá ngay <ArrowUpRight size={15} />
						</span>
					</div>
					<img src="/images/products/airpods.png" alt="AirPods Pro" />
				</Link>
			</div>
		</section>
	);
}
