---
name: icp-criteria
description: Xây dựng bộ hồ sơ khách hàng lý tưởng (Ideal Customer Profile - ICP) và khung chấm điểm lead (Lead Scoring Model) dựa trên file product-marketing.md. Sử dụng ở Bước 6 của quy trình.
metadata:
  version: 2.0.0
---

# ICP & Lead Criteria Generator

Kỹ năng này chịu trách nhiệm chuyển đổi định vị doanh nghiệp và giải pháp thành bộ tiêu chí định lượng để sàng lọc khách hàng tiềm năng.

## 1. Kiểm tra tiền điều kiện
- Đọc file `product-marketing.md`. Nếu chưa có, kích hoạt kỹ năng `product-marketing` trước.

## 2. Tiêu chí phân loại đa tầng
1. **Tiêu chí Doanh nghiệp (Firmographics):**
   - Ngành nghề phù hợp (Target Industries).
   - Quy mô nhân sự (Team size) và doanh thu ước tính.
   - Khu vực địa lý (Location/Territory).
2. **Tiêu chí Người ra quyết định (Buyer Persona):**
   - Chức danh (Job titles: CEO, CMO, Head of Ops, IT Director...).
3. **Tín hiệu mua hàng (Buying Intent Signals):**
   - Tín hiệu tăng trưởng: Vừa gọi vốn, đang tuyển dụng mạnh, mở rộng chi nhánh.
   - Tín hiệu nhu cầu: Đang tìm kiếm giải pháp chuyển đổi số, thay đổi nhân sự cấp cao.
4. **Khung chấm điểm Lead (Thang điểm 100):**
   - 80 - 100 điểm: **Hot Lead** (Đủ điều kiện tiếp cận ngay).
   - 50 - 79 điểm: **Warm Lead** (Nuôi dưỡng thêm thông tin).
   - < 50 điểm: **Disqualified** (Bỏ qua).

## 3. Đầu ra bắt buộc
- Ghi vào file: `outputs/01_icp_criteria/icp_criteria.json` và `icp_criteria.md`.

## 4. Checkpoint hỏi người dùng
- *"Đây là bộ tiêu chí ICP và thang chấm điểm Lead được tính toán. Bạn có muốn thêm điều kiện loại trừ nào không (ví dụ: loại trừ đối thủ cạnh tranh, loại trừ doanh nghiệp có quy mô quá nhỏ...)?"*
