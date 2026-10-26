import axios from "axios";

export const api = axios.create({ baseURL: "/api", timeout: 10000 });

export function apiMessage(error: unknown) {
	if (axios.isAxiosError(error))
		return error.response?.status === 404
			? "Không tìm thấy sản phẩm."
			: "Không thể tải sản phẩm. Vui lòng thử lại.";
	return "Không thể tải sản phẩm. Vui lòng thử lại.";
}
