import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { Boxes, RotateCw, Search, SlidersHorizontal } from "lucide-react";
import { apiMessage } from "../../api/client";
import { listProducts } from "../../api/products";
import { Pagination } from "../../components/share/Pagination/Pagination";
import type {
	Product,
	ProductListResponse,
	Category,
} from "../../types/product";
import { categoryLabels } from "../../types/product";
import { ProductTable } from "./components/ProductTable/ProductTable";
import { ProductDetail } from "./components/ProductDetail/ProductDetail";
import styles from "./Products.module.css";

type RequestState = {
	key: string;
	result?: ProductListResponse;
	error?: string;
};

export function Products() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<Category | "">("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [refresh, setRefresh] = useState(0);
	const listRef = useRef<HTMLElement>(null);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [request, setRequest] = useState<RequestState | null>(null);
	const key = JSON.stringify({ page, pageSize, search, category, refresh });
	const current = request?.key === key ? request : null;
	const loading = current === null;
	const products = current?.result?.data ?? [];
	const selectedProduct = products.find(
		(product) => product.id === selectedId,
	);

	useEffect(() => {
		const controller = new AbortController();
		listProducts(
			{ page, limit: pageSize, search, category },
			controller.signal,
		)
			.then((result) => {
				const lastPage = Math.max(1, result.meta.totalPages);
				if (page > lastPage) {
					setPage(lastPage);
					return;
				}
				setRequest({ key, result });
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted)
					setRequest({ key, error: apiMessage(error) });
			});
		return () => controller.abort();
	}, [page, pageSize, search, category, refresh, key]);

	function submitSearch(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setSearch(searchInput.trim());
		setPage(1);
		setSelectedId(null);
	}

	function selectProduct(product: Product) {
		setSelectedId((previous) =>
			previous === product.id ? null : product.id,
		);
	}

	function changePage(next: number) {
		setPage(next);
		setSelectedId(null);
		scrollToList();
	}

	function changePageSize(next: number) {
		setPageSize(next);
		setPage(1);
		setSelectedId(null);
		scrollToList();
	}

	function scrollToList() {
		listRef.current?.scrollIntoView({
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
				.matches
				? "auto"
				: "smooth",
			block: "start",
		});
	}

	return (
		<div className={styles.page}>
			<div className={styles.heading}>
				<div>
					<span className={styles.eyebrow}>DANH MỤC CỬA HÀNG</span>
					<h1>
						Sản phẩm<span>.</span>
					</h1>
					<p>
						Xem danh mục, phiên bản và SKU được trả về từ Product
						Service.
					</p>
				</div>
				<div className={styles.headingIcon}>
					<Boxes size={25} />
				</div>
			</div>
			<div className={styles.infoBar}>
				<span className={styles.infoDot} />
				<span>Chế độ xem danh mục</span>
				<span className={styles.infoSeparator}>·</span>
				<span>
					Thao tác thêm và chỉnh sửa sẽ được bổ sung trong luồng quản
					trị.
				</span>
			</div>
			<section
				className={styles.card}
				aria-label="Danh sách sản phẩm"
				ref={listRef}
			>
				<div className={styles.cardHeader}>
					<div>
						<h2>Danh sách sản phẩm</h2>
						<p>
							{current?.result
								? `${current.result.meta.total.toLocaleString("vi-VN")} sản phẩm đang hiển thị`
								: "Dữ liệu từ Product Service"}
						</p>
					</div>
					<button
						type="button"
						className={styles.refresh}
						onClick={() => setRefresh((value) => value + 1)}
						title="Tải lại danh sách"
					>
						<RotateCw size={16} /> <span>Làm mới</span>
					</button>
				</div>
				<div className={styles.filters}>
					<form onSubmit={submitSearch} className={styles.search}>
						<Search size={17} />
						<input
							type="search"
							value={searchInput}
							onChange={(event) =>
								setSearchInput(event.target.value)
							}
							placeholder="Tìm tên hoặc thương hiệu..."
							aria-label="Tìm sản phẩm"
						/>
						<button type="submit">Tìm</button>
					</form>
					<div className={styles.selectWrap}>
						<SlidersHorizontal size={16} />
						<select
							value={category}
							onChange={(event) => {
								setCategory(
									event.target.value as Category | "",
								);
								setPage(1);
								setSelectedId(null);
							}}
							aria-label="Lọc theo danh mục"
						>
							<option value="">Tất cả danh mục</option>
							{(Object.keys(categoryLabels) as Category[]).map(
								(id) => (
									<option key={id} value={id}>
										{categoryLabels[id]}
									</option>
								),
							)}
						</select>
					</div>
				</div>
				{loading ? (
					<div className={styles.state} role="status">
						<span className={styles.spinner} /> Đang tải sản phẩm...
					</div>
				) : current?.error ? (
					<div className={styles.state} role="alert">
						<strong>Không thể tải danh sách</strong>
						<p>{current.error}</p>
						<button
							type="button"
							onClick={() => setRefresh((value) => value + 1)}
						>
							Thử lại
						</button>
					</div>
				) : products.length === 0 ? (
					<div className={styles.state}>
						<Boxes size={27} />
						<strong>Không tìm thấy sản phẩm</strong>
						<p>Hãy thử từ khóa hoặc danh mục khác.</p>
					</div>
				) : (
					<ProductTable
						products={products}
						selectedId={selectedId}
						onSelect={selectProduct}
					/>
				)}
			</section>
			{current?.result && (
				<div className={styles.paginationFooter}>
					<Pagination
						page={current.result.meta.page}
						pageSize={pageSize}
						totalItems={current.result.meta.total}
						totalPages={current.result.meta.totalPages}
						onPageChange={changePage}
						onPageSizeChange={changePageSize}
					/>
				</div>
			)}
			{selectedProduct && (
				<ProductDetail
					product={selectedProduct}
					onClose={() => setSelectedId(null)}
				/>
			)}
		</div>
	);
}
