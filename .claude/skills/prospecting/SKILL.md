---
name: prospecting
description: Tìm kiếm, sàng lọc và xây dựng danh sách khách hàng tiềm năng đạt chuẩn ICP từ nhiều nguồn khác nhau (LinkedIn, Maps, Website B2B, Social). Sử dụng ở Bước 7 và Bước 8 của quy trình.
metadata:
  version: 2.0.0
---

# Prospecting & Lead Discovery

Kỹ năng này hướng dẫn và thực thi việc tìm kiếm danh sách khách hàng tiềm năng dựa trên tiêu chí ICP đã chốt tại `outputs/01_icp_criteria/icp_criteria.json`.

## 1. Phân nhánh tìm kiếm (Pick the Branch)
Dựa trên loại hình sản phẩm trong `product-marketing.md`, chọn một trong 4 nhánh tiếp cận:

| Nhánh | Đối tượng hướng tới | Nguồn dữ liệu tối ưu |
| :--- | :--- | :--- |
| **SaaS & Tech** | Công ty công nghệ, phần mềm, digital | LinkedIn, Crunchbase, GitHub, ProductHunt, BuiltWith |
| **B2B Doanh nghiệp** | Doanh nghiệp sản xuất, xuất nhập khẩu, logistics, dịch vụ | LinkedIn Sales Navigator, Trang vàng, Danh bạ B2B |
| **Local SMB** | Doanh nghiệp địa phương (phòng khám, nhà hàng, bán lẻ, gym) | Google Maps, Facebook Pages, Website doanh nghiệp |
| **Demand-Signal** | Khách hàng đầu tiên có tín hiệu bức xúc / nhu cầu gấp | Nhóm cộng đồng thảo luận, bài đăng tuyển dụng, diễn đàn |

---

## 2. Checkpoints hỏi người dùng (Bước 7 & Bước 8)

### Checkpoint Bước 7 (Lựa chọn kênh & Công cụ):
- *"Dựa trên hồ sơ ICP của bạn, nhóm khách hàng lý tưởng nằm ở nhánh [Tên nhánh]. Bạn muốn cào lead từ nền tảng nào trước tiên?"*
  1. *LinkedIn (Chuyên gia, Quản lý B2B)*
  2. *Facebook (Chủ shop, cộng đồng doanh nghiệp)*
  3. *Google Maps (Doanh nghiệp địa phương theo tỉnh thành)*
  4. *Danh bạ doanh nghiệp / Website B2B*

### Checkpoint Bước 8 (Tiếp nhận thông tin tài khoản an toàn):
- *"Để đảm bảo tài khoản của bạn tuyệt đối không bị khóa hoặc dính checkpoint:*
  1. *Vui lòng sử dụng Session Cookie (lấy qua F12 Application) thay vì cung cấp mật khẩu.*
  2. *Nên dùng tài khoản phụ (Secondary/Burner Account).*
  *Bạn muốn điền cookie vào file `config/.env` hay dán trực tiếp vào đây?"*

---

## 3. Ranh giới tuân thủ & An toàn (Compliance Guardrails)
1. **Không cào ồ ạt (No Bulk Scraping):** Giãn cách ngẫu nhiên 5-15 giây giữa các lượt quét.
2. **Lưu vết nguồn gốc (Data Lineage):** Mỗi lead phải ghi nhận URL nguồn và ngày thu thập để tuân thủ quy chuẩn liên hệ.
3. **Loại trừ trùng lặp (Deduplication):** Tự động lọc trùng theo Domain website hoặc Email/SĐT.

---

## 4. Đầu ra
Lưu danh sách lead vào `outputs/02_crawled_leads/leads_raw.json`.
Gợi ý danh sách Top 5 lead đạt điểm ICP cao nhất để người dùng ưu tiên tiếp cận đầu tiên.
