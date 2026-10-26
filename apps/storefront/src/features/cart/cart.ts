export const MAX_QUANTITY=99;
export type CartLine={variantId:number;quantity:number};
export function addLine(lines:CartLine[],variantId:number,quantity:number):CartLine[]{
 if(!Number.isInteger(variantId)||variantId<1||!Number.isInteger(quantity)||quantity<1)return lines;
 const existing=lines.find(line=>line.variantId===variantId);
 return existing?lines.map(line=>line.variantId===variantId?{...line,quantity:Math.min(MAX_QUANTITY,line.quantity+quantity)}:line):[...lines,{variantId,quantity:Math.min(MAX_QUANTITY,quantity)}];
}
export function changeQuantity(lines:CartLine[],variantId:number,quantity:number):CartLine[]{
 if(!Number.isInteger(quantity)||quantity<1||quantity>MAX_QUANTITY)return lines;
 return lines.map(line=>line.variantId===variantId?{...line,quantity}:line);
}
