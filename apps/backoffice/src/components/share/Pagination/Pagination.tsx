import { useId, useState, type SubmitEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

type Props = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	pageSizeOptions?: readonly number[];
	disabled?: boolean;
};

const defaultPageSizeOptions = [5, 10, 20, 30] as const;

function PageInput({
	page,
	totalPages,
	onPageChange,
	disabled,
}: Pick<Props, "page" | "totalPages" | "onPageChange" | "disabled">) {
	const inputId = useId();
	const [draft, setDraft] = useState(String(page));
	const lastPage = Math.max(1, totalPages);

	function commit() {
		const parsed = Number(draft);
		if (!/^\d+$/.test(draft.trim()) || !Number.isSafeInteger(parsed)) {
			setDraft(String(page));
			return;
		}
		const next = Math.min(Math.max(parsed, 1), lastPage);
		setDraft(String(next));
		if (next !== page) onPageChange(next);
	}

	function submit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		commit();
	}

	return (
		<form className={styles.pageForm} onSubmit={submit} noValidate>
			<label htmlFor={inputId}>Trang</label>
			<input
				id={inputId}
				name="page"
				type="number"
				inputMode="numeric"
				min={1}
				max={lastPage}
				step={1}
				value={draft}
				onChange={(event) => setDraft(event.target.value)}
				onBlur={commit}
				disabled={disabled || totalPages === 0}
				aria-label={`Trang hiện tại, từ 1 đến ${lastPage}`}
			/>
			<span>/ {lastPage}</span>
		</form>
	);
}

export function Pagination({
	page,
	pageSize,
	totalItems,
	totalPages,
	onPageChange,
	onPageSizeChange,
	pageSizeOptions = defaultPageSizeOptions,
	disabled = false,
}: Props) {
	const pageSizeId = useId();
	const first = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
	const last = Math.min(page * pageSize, totalItems);
	const lastPage = Math.max(1, totalPages);

	return (
		<nav className={styles.pagination} aria-label="Phân trang dữ liệu">
			<div className={styles.sizeControl}>
				<label htmlFor={pageSizeId}>Số dòng mỗi trang</label>
				<select
					id={pageSizeId}
					value={pageSize}
					disabled={disabled}
					onChange={(event) =>
						onPageSizeChange(Number(event.target.value))
					}
				>
					{pageSizeOptions.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</div>
			<p className={styles.range}>
				Hiển thị{" "}
				<strong>
					{first}–{last}
				</strong>{" "}
				/ <strong>{totalItems.toLocaleString("vi-VN")}</strong> mục
			</p>
			<div className={styles.controls}>
				<button
					type="button"
					disabled={disabled || page <= 1}
					onClick={() => onPageChange(page - 1)}
					aria-label="Trang trước"
				>
					<ChevronLeft size={17} />
					<span>Trước</span>
				</button>
				<PageInput
					key={`${page}-${lastPage}`}
					page={page}
					totalPages={totalPages}
					onPageChange={onPageChange}
					disabled={disabled}
				/>
				<button
					type="button"
					disabled={disabled || page >= lastPage}
					onClick={() => onPageChange(page + 1)}
					aria-label="Trang sau"
				>
					<span>Sau</span>
					<ChevronRight size={17} />
				</button>
			</div>
		</nav>
	);
}
