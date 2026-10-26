# API lấy danh sách sản phẩm

Luồng: client → `GET /api/products` (gateway, port 3000) → `GET /products` (product-service, port 3002) → PostgreSQL `product_db.products`.

Đây là **một API nghiệp vụ duy nhất**. Chưa có API chi tiết/thêm/sửa/xóa sản phẩm. `/health` giữ nguyên để kiểm tra tiến trình. Frontend vẫn dùng dữ liệu local ở bước này.

## Chạy tại thư mục gốc project

```bash
npm install
docker compose up -d --wait postgres
```

Nếu chưa có file cấu hình, sao chép `.env.example` tương ứng sang `.env` cho root, `services/product-service` và `services/api-gateway`. Không ghi đè `.env` đang dùng.

- Product service cần `DATABASE_URL`, `PORT=3002`. Mẫu DATABASE_URL đã trỏ vào `product_db` bằng `product_user`.
- Gateway cần `PRODUCT_SERVICE_URL=http://localhost:3002`, `PORT=3000`, `CLIENT_ORIGIN=http://localhost:5173`.
- Các lệnh npm workspace chạy với thư mục làm việc của service, nên dotenv đọc đúng `.env` của service đó.
- Script `infra/postgres/init/01-databases.sql` tạo role/database khi volume PostgreSQL được khởi tạo lần đầu. Nếu dùng volume cũ chưa có `product_db`, phải tạo database/role tương ứng; không cần xóa volume.

Mở hai terminal:

```bash
npm run dev -w services/product-service
```

```bash
npm run dev -w services/api-gateway
```

Gọi API qua gateway:

```bash
curl 'http://localhost:3000/api/products?page=1&limit=8'
curl 'http://localhost:3000/api/products?category=phone&brand=Apple&sort=asc'
curl 'http://localhost:3000/api/products?q=iphone&page=1&limit=8'
```

Response:

```json
{
  "data": [
    {
      "id": "iphone-16-128",
      "variantGroup": "iphone-16",
      "name": "iPhone 16 128GB",
      "brand": "Apple",
      "category": "phone",
      "image": "/images/products/iphone-16-128.png",
      "price": 18990000,
      "specs": ["128GB", "Apple A18"],
      "color": "Nhiều lựa chọn màu sắc",
      "badge": "Nổi bật",
      "description": "..."
    }
  ],
  "pagination": {"page": 1, "limit": 8, "total": 26, "totalPages": 4, "hasNext": true}
}
```

Ví dụ trên rút gọn `data` còn một sản phẩm. Ảnh vẫn là đường dẫn tương đối do frontend phục vụ từ `public`; product-service không phục vụ ảnh.

| Query | Quy tắc |
| --- | --- |
| `page` | Mặc định 1, số nguyên 1–100000 |
| `limit` | Mặc định 8, số nguyên 1–50 |
| `category` | phone, laptop, tablet, audio, watch |
| `brand` | Tên thương hiệu, không phân biệt hoa/thường |
| `q` | Tìm trong tên/thương hiệu, tối đa 200 ký tự, không phân biệt hoa/thường; chưa bỏ dấu tiếng Việt |
| `sort` | featured (mặc định, thứ tự seed), asc hoặc desc theo giá; ID phân định thứ tự khi bằng giá |

Sai query/parameter lặp/parameter không hỗ trợ trả `400`. Trang vượt số trang trả `data: []` và giữ tổng số thực. Gateway trả `502` nếu product-service lỗi/không kết nối được; `504` nếu quá thời gian 5 giây. SQL dùng parameter binding; không đưa trực tiếp query người dùng vào ORDER BY.

## Cấu trúc

- `src/config/env.ts`: cấu hình và kiểm tra biến môi trường.
- `src/database/pool.ts`: PostgreSQL connection pool.
- `src/database/initialize.ts`: schema ban đầu và seed có điều kiện.
- `src/database/seeds/products.ts`: bản chụp độc lập của 26 sản phẩm mẫu từ frontend, không import frontend lúc chạy.
- `src/routes/product.routes.ts`: khai báo GET `/products`.
- `src/controllers/product.controller.ts`: nhận request, validate query, trả response.
- `src/validators/product-query.ts`: validate query.
- `src/services/product.service.ts`: xử lý danh sách và metadata phân trang.
- `src/repositories/product.repository.ts`: SQL và ánh xạ dữ liệu.
- `src/middlewares/error-handler.ts`: chuẩn hóa lỗi, không trả chi tiết SQL ra client.
- `src/app.ts`: ghép dependencies, có thể inject pool khi test.
- `src/index.ts`: khởi tạo database trước khi listen; shutdown đóng server và pool.

Gateway tách `app.ts`, `routes/product.routes.ts`, `controllers/product.controller.ts`, `index.ts`. Gateway chỉ chuyển request/response, không truy cập database. Các proxy scaffold khác được giữ nguyên.

## Seed

Khi khởi động, service tạo bảng nếu chưa có, khóa trong transaction rồi kiểm tra bảng. Chỉ seed khi **không có bất kỳ dòng nào**. Nếu bảng có dữ liệu, bỏ qua toàn bộ seed, không bổ sung bản ghi thiếu và không ghi đè dữ liệu đã chỉnh. Lỗi insert rollback toàn bộ; service không listen khi khởi tạo thất bại. Hai instance khởi động đồng thời không seed trùng.

Transaction sử dụng cùng một PostgreSQL client theo [tài liệu node-postgres](https://node-postgres.com/features/transactions). Khóa advisory đồng bộ bước tạo schema và khóa bảng bảo vệ bước kiểm tra/insert. Đây là schema khởi tạo cho API đầu tiên; thay đổi schema sau này nên dùng migration có phiên bản.

## Kiểm tra

```bash
npm run build -w services/product-service
npm run build -w services/api-gateway
# Cấp TEST_DATABASE_URL bằng cấu hình môi trường của máy bạn:
npm run test:integration -w services/product-service
```

Integration test yêu cầu PostgreSQL thật và `TEST_DATABASE_URL` có quyền tạo schema. Test tự tạo schema có tên ngẫu nhiên rồi xóa đúng schema đó trong finally; không sửa bảng `public.products`. Bao phủ seed rỗng/không rỗng, đồng thời, rollback, phân trang, bộ lọc, query sai, chống SQL injection, CORS, 404, upstream 502/504.
