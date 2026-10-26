# Cập nhật sản phẩm và các phiên bản

`PATCH /api/products/:id` đi qua API Gateway tới `PATCH /products/:id` của Product Service. `id` trong URL là số nguyên ID của Product; **không gửi `id` của Product trong body**. Trả về `ProductDto` với các variant đang hoạt động, theo thứ tự `displayOrder`.

Đây là PATCH một phần. Chỉ gửi trường cần đổi. `variants` là mảng thao tác trong cùng một transaction:

- Có `id`: sửa variant hiện có của đúng Product này. Chỉ các trường được gửi mới thay đổi.
- Không có `id`: tạo variant mới. Bắt buộc `sku`, `color`, `price`, `image`; `storage`, `ram`, `isActive`, `displayOrder` là tùy chọn.
- Không gửi một variant: giữ nguyên variant đó.
- Gửi `isActive: false`: ngừng bán, vẫn giữ ID và hàng trong database. Variant ngừng bán sẽ không xuất hiện trong response và danh sách sản phẩm. Gửi `isActive: true` cùng ID để bật lại.
- Gửi `storage: null`, `ram: null`, hoặc `badge: null` để xóa giá trị tùy chọn.

Ví dụ cập nhật tên, hai variant hiện có và thêm một variant:

```http
PATCH /api/products/12
Content-Type: application/json

{
  "name": "iPhone 16",
  "variants": [
    { "id": 41, "price": 22990000, "color": "Đen" },
    { "id": 42, "isActive": false },
    {
      "sku": "IP16-512-PINK",
      "color": "Hồng",
      "storage": "512GB",
      "ram": "8GB",
      "price": 29990000,
      "image": "/images/products/phone/iphone-16-pink.webp"
    }
  ]
}
```

Có thể sửa các trường Product: `slug`, `name`, `brand`, `category`, `specs`, `badge`, `description`. Variant cho phép: `sku`, `color`, `storage`, `ram`, `price`, `image`, `isActive`, `displayOrder`. `price` là số nguyên VND dương. `category` chỉ nhận `phone`, `laptop`, `tablet`, `audio`, `watch`.

Validation trả `400` cho body/ID sai, variant không thuộc Product, ID/SKU lặp trong request. Product không tồn tại trả `404`; `slug` hoặc `sku` đã được dùng trả `409`. Toàn bộ cập nhật chạy trong một Prisma transaction: nếu bất kỳ variant nào lỗi, thay đổi Product và các variant trước đó cũng rollback. SKU hoán đổi trực tiếp giữa hai variant trong một request sẽ va unique constraint; cần một SKU tạm hoặc API chuyên biệt nếu có nhu cầu đó.

Hiện route chưa có middleware phân quyền. Trước khi cho quản trị viên sử dụng trên môi trường công khai, thêm xác thực và quyền quản trị ở gateway/service.
