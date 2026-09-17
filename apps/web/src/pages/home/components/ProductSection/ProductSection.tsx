import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
	ChevronLeft,
	ChevronRight,
	SearchX,
	SlidersHorizontal,
	X,
} from "lucide-react";
import ProductResults from "../ProductResults/ProductResults";
import { categories } from "../../../../config/categories";
import { products } from "../../data/products";
import styles from "./ProductSection.module.css";
const normalize = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/gi, "d")
		.toLowerCase();
export default function ProductSection() {
	const [params, setParams] = useSearchParams();
	const [sort, setSort] = useState("featured");
	const category = params.get("category");
	const query = params.get("q") ?? "";
	const BRANDS_PER_VIEW = 5;
	const [brandStartIndex, setBrandStartIndex] = useState(0);
	const brandList = [
		"",
		...Array.from(
			new Set(
				products
					.filter(
						(product) => !category || product.category === category,
					)
					.map((product) => product.brand),
			),
		),
	];
	const brand = params.get("brand") ?? "";
	const selectedCategory = categories.find((item) => item.id === category);
	const matching = products.filter(
		(product) =>
			(!category || product.category === category) &&
			(!query ||
				normalize(
					`${product.name} ${product.brand} ${categories.find((item) => item.id === product.category)?.label}`,
				).includes(normalize(query))) &&
			(!brand || product.brand === brand),
	);
	const sorted = [...matching].sort((a, b) =>
		sort === "asc"
			? a.price - b.price
			: sort === "desc"
				? b.price - a.price
				: 0,
	);

	useEffect(() => {
		setBrandStartIndex(0);
	}, [category]);

	// Show/hide Prev/Next brand
	const showPrevBrand = brandStartIndex > 0;
	const showNextBrand = brandStartIndex + BRANDS_PER_VIEW < brandList.length;

	const handlePrevBrand = () => {
		setBrandStartIndex((prev) => Math.max(0, prev - BRANDS_PER_VIEW));
	};

	const handleNextBrand = () => {
		setBrandStartIndex((prev) =>
			Math.min(
				brandList.length - BRANDS_PER_VIEW,
				prev + BRANDS_PER_VIEW,
			),
		);
	};

	// Visible brand list
	const visibleBrands = brandList.slice(
		brandStartIndex,
		brandStartIndex + BRANDS_PER_VIEW,
	);

	function filterBrand(value: string) {
		const next = new URLSearchParams(params);
		if (value) next.set("brand", value);
		else next.delete("brand");
		setParams(next);
	}
	const filtered = Boolean(category || query || brand);
	return (
		<section
			id="products"
			className={styles.section}
			aria-labelledby="products-title"
		>
			<div className={styles.heading}>
				<div>
					<span className={styles.eyebrow}>KHÁM PHÁ CÙNG MINI</span>
					<h2 id="products-title">
						{query
							? `Kết quả cho “${query}”`
							: (selectedCategory?.label ??
								"Thiết bị đáng khám phá")}
					</h2>
				</div>
				<p>Tìm lựa chọn phù hợp với bạn</p>
			</div>
			<div className={styles.toolbar}>
				<div className={styles.brandFilterWrapper}>
					{showPrevBrand && (
						<button
							type="button"
							className={styles.navButton}
							onClick={handlePrevBrand}
							aria-label="Thương hiệu trước"
						>
							<ChevronLeft size={16} />
						</button>
					)}

					<div className={styles.brands} aria-label="Lọc thương hiệu">
						{visibleBrands.map((item) => (
							<button
								key={item}
								type="button"
								aria-pressed={brand === item}
								className={
									brand === item ? styles.active : undefined
								}
								onClick={() => filterBrand(item)}
							>
								{item || "Tất cả"}
							</button>
						))}
					</div>

					{showNextBrand && (
						<button
							type="button"
							className={styles.navButton}
							onClick={handleNextBrand}
							aria-label="Thương hiệu tiếp theo"
						>
							<ChevronRight size={16} />
						</button>
					)}
				</div>
				<label className={styles.sort}>
					<SlidersHorizontal size={15} />
					<span className={styles.sortLabel}>Sắp xếp:</span>
					<select
						aria-label="Sắp xếp sản phẩm"
						value={sort}
						onChange={(event) => setSort(event.target.value)}
					>
						<option value="featured">Nổi bật</option>
						<option value="asc">Giá thấp đến cao</option>
						<option value="desc">Giá cao đến thấp</option>
					</select>
				</label>
			</div>
			<div className={styles.result}>
				<span role="status">
					{sorted.length} sản phẩm
					{filtered ? " phù hợp" : " dành cho bạn"}
				</span>
				{filtered && (
					<button type="button" onClick={() => setParams({})}>
						Xóa bộ lọc <X size={13} />
					</button>
				)}
			</div>
			{sorted.length ? (
				<ProductResults
					key={JSON.stringify([category, query, brand, sort])}
					products={sorted}
				/>
			) : (
				<div className={styles.empty}>
					<SearchX size={40} strokeWidth={1.3} />
					<h3>Chưa tìm thấy sản phẩm phù hợp</h3>
					<p>Thử một từ khóa khác hoặc bỏ bớt bộ lọc nhé.</p>
					<button type="button" onClick={() => setParams({})}>
						Xem tất cả sản phẩm
					</button>
				</div>
			)}
		</section>
	);
}
