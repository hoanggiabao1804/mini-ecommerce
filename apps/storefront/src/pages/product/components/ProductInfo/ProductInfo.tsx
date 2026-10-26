import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, CheckCircle2, Check } from "lucide-react";
import type { ProductVariant } from "../../../../types/product";
import { useCart } from "../../../../features/cart/useCart";
import { MAX_QUANTITY } from "../../../../features/cart/cart";
import { formatPrice, variantLabel, type Product } from "../../../../types/product";
import QuantityPicker from "../../../../components/share/QuantityPicker/QuantityPicker";
import styles from "./ProductInfo.module.css";
export default function ProductInfo({ product, selected, onSelect }: { product: Product; selected: ProductVariant; onSelect: (id:number)=>void }) {
	const [quantity, setQuantity] = useState(1);
	const [message, setMessage] = useState("");
	const { addItem, lines } = useCart();
	const navigate = useNavigate();
	const variants=product.variants;
	const configurations=[...new Set(variants.map(v=>[v.storage,v.ram].filter(Boolean).join(" · ")))];
	const colors=[...new Set(variants.filter(v=>[v.storage,v.ram].filter(Boolean).join(" · ")=== [selected.storage,selected.ram].filter(Boolean).join(" · ")).map(v=>v.color))];
	function selectConfig(config:string){const match=variants.find(v=>[v.storage,v.ram].filter(Boolean).join(" · ")===config&&v.color===selected.color)??variants.find(v=>[v.storage,v.ram].filter(Boolean).join(" · ")===config);if(match)onSelect(match.id);}
	function selectColor(color:string){const match=variants.find(v=>v.color===color&&v.storage===selected.storage&&v.ram===selected.ram);if(match)onSelect(match.id);}
	const inCart =
		lines.find((line) => line.variantId === selected.id)?.quantity ?? 0;
	function add(buyNow = false) {
		const added = Math.min(quantity, MAX_QUANTITY - inCart);
		if (added > 0) addItem(selected.id, added);
		setMessage(
			added > 0
				? `Đã thêm ${added} sản phẩm vào giỏ hàng.`
				: `Giỏ đã có ${MAX_QUANTITY} sản phẩm với cấu hình này.`,
		);
		if (buyNow) navigate("/cart");
	}
	return (
		<section className={styles.info} aria-labelledby="product-title">
			<div className={styles.meta}>
				<span>{product.brand}</span>
				<span>Mã sản phẩm: {selected.sku}</span>
			</div>
			<h1 id="product-title">{product.name}</h1>
			<a href="#description" className={styles.readMore}>
				Xem mô tả và thông tin sản phẩm <ArrowRight size={14} />
			</a>
			<div className={styles.price}>
				<span>Giá sản phẩm</span>
				<strong>{formatPrice(selected.price)}</strong>
				<p>{selected.color}</p>
			</div>
			<fieldset className={styles.variants}><legend>Chọn cấu hình</legend><div>{configurations.map(config=><label key={config} className={config===[selected.storage,selected.ram].filter(Boolean).join(" · ")?styles.selected:undefined}><input type="radio" name="configuration" checked={config===[selected.storage,selected.ram].filter(Boolean).join(" · ")} onChange={()=>selectConfig(config)} /><span className={styles.variantSpecs}>{config || "Phiên bản tiêu chuẩn"}</span></label>)}</div></fieldset>
            <fieldset className={styles.variants}><legend>Chọn màu sắc</legend><div>{colors.map(color=><label key={color} className={color===selected.color?styles.selected:undefined}><input type="radio" name="color" checked={color===selected.color} onChange={()=>selectColor(color)} /><span className={styles.variantSpecs}>{color}</span>{color===selected.color&&<Check size={13} className={styles.check}/>}</label>)}</div></fieldset>
            <p className={styles.hint}>Cấu hình đã chọn: {variantLabel(selected)}</p>
			<div className={styles.quantity}>
				<label>Số lượng</label>
				<QuantityPicker
					value={quantity}
					onChange={(next) => {
						setQuantity(next);
						setMessage("");
					}}
				/>
				<span>{inCart > 0 ? `Đã có ${inCart} trong giỏ` : ""}</span>
			</div>
			<div className={styles.buttons}>
				<button
					type="button"
					className={styles.add}
					onClick={() => add()}
				>
					<ShoppingCart size={19} />
					Thêm vào giỏ hàng
				</button>
				<button
					type="button"
					className={styles.buy}
					onClick={() => add(true)}
				>
					Mua ngay
					<ArrowRight size={18} />
				</button>
			</div>
			<div className={styles.feedback} role="status">
				{message && (
					<>
						<CheckCircle2 size={17} />
						<span>
							{message} <Link to="/cart">Xem giỏ hàng</Link>
						</span>
					</>
				)}
			</div>
			<p className={styles.hint}>
				“Mua ngay” thêm cấu hình đã chọn vào giỏ và mở giỏ hàng.
			</p>
		</section>
	);
}
