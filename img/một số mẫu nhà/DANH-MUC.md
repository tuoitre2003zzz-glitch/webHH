# Danh mục ảnh mẫu nhà

## Cấu trúc thư mục

Mỗi ảnh được xếp theo dự toán, phong cách, số tầng và kiểu mái:

Ảnh đã có thông tin dự toán được xếp theo:

`<nhóm-dự-toán>/<phong-cách>/<số-tầng>-tang/<kiểu-mái>/mau-nha-<mã>.<đuôi>`

Ảnh mới do người dùng bổ sung được xếp theo ước lượng sơ bộ từ quy mô nhìn thấy:

`<nhóm-dự-toán-ước-lượng>/<phong-cách>/<số-tầng>-tang/<kiểu-mái-ước-lượng>/<tên-ảnh-gốc>`

Ví dụ: `1 tỷ to 1 tỷ 499/hien-dai/2-tang/mai-ton-gia-ngoi/mau-nha-06.svg`.

### Phong cách

| Thư mục | Giá trị trong bảng dự toán |
|---|---|
| `hien-dai` | Hiện đại |
| `tan-co-dien` | Tân cổ điển |
| `co-dien` | Cổ điển |
| `nha-gac-lung` | Nhà gác lửng |

### Kiểu mái

| Thư mục | Lựa chọn trong bảng dự toán |
|---|---|
| `mai-ton-thuong` | Mái tôn thông thường |
| `mai-ton-gia-ngoi` | Mái tôn giả ngói / sóng ngói |
| `mai-ngoi` | Mái ngói |
| `mai-btct` | Mái BTCT hoàn thiện cơ bản |
| `mai-btct-san-thuong` | Mái BTCT có sân thượng / ban công |

Các ảnh mới được đánh mã 19–32 trong `main.js`. Nhóm dự toán là ước lượng bằng mắt theo quy mô/độ phức tạp nhìn thấy; phong cách, số tầng và mái cũng là phân loại sơ bộ. Không ảnh nào cung cấp đủ kích thước, mặt bằng, móng hay vật liệu để làm báo giá. Khi có thông tin công trình thật, cập nhật lại các nhánh thư mục và metadata. Dự toán trên website vẫn được tính từ thông tin người dùng nhập.

| Mã | Phân loại sơ bộ |
|---|---|
| 18 | Từ 3 tỷ · Cổ điển · 3 tầng · mái Mansard, chóp vòm |
| 19 | 1,5–2 tỷ · Tân cổ điển · 1 tầng · mái bằng |
| 20 | 2,5–3 tỷ · Tân cổ điển · 2 tầng · mái Thái |
| 21 | 1,5–2 tỷ · Hiện đại · 2 tầng · mái Nhật |
| 22 | 1,5–2 tỷ · Tân cổ điển · 2 tầng · mái bằng |
| 23 | 1–1,5 tỷ · Hiện đại · 3 tầng · mái bằng |
| 24 | 1–1,5 tỷ · Tân cổ điển · 1 tầng · mái Thái |
| 25–26 | 1,5–2 tỷ · Hiện đại · 1 tầng · mái Nhật |
| 27 | 1–1,5 tỷ · Hiện đại · 1 tầng · mái bằng |
| 28 | 1–1,5 tỷ · Hiện đại · 2 tầng · mái bằng |
| 29 | 1,5–2 tỷ · Hiện đại · 2 tầng · mái bằng |
| 30 | 1,5–2 tỷ · Tân cổ điển · 1 tầng · mái Nhật |
| 31 | 1–1,5 tỷ · Hiện đại · 3 tầng · mái bằng |
| 32 | 1–1,5 tỷ · Hiện đại · 2 tầng · mái bằng |

Ảnh `3 tỷ +/co-dien/3-tang/mai-ngoi/mau-nha-18.jpg` là phối cảnh 3D tham khảo đã có và được dùng cho mẫu 18; ảnh gốc `ảnh tham khảo.jpg` vẫn được giữ nguyên. Các SVG còn lại là minh họa. Khi bổ sung ảnh phối cảnh, cập nhật `imageFile` và metadata của mẫu tương ứng trong `main.js`.

Tên thư mục mái (`mai-ngoi`, `mai-btct`, ...) phục vụ nhóm hệ số chi phí tham khảo, không diễn tả chính xác hình dáng mái. Hình dáng mái nhìn thấy được lưu riêng trong `roofStyle` và hiển thị trên thẻ mẫu.
