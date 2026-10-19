---
name: prospecting
description: Tìm kiếm, sàng lọc và xây dựng danh sách khách hàng tiềm năng đạt chuẩn ICP từ nhiều nguồn khác nhau (LinkedIn, Maps, Website B2B, Social). Sử dụng ở bước 8 (tìm khách) của chu trình, theo từng chiến dịch.
metadata:
  version: 2.0.0
---

# Prospecting & Lead Discovery

Kỹ năng này hướng dẫn và thực thi việc tìm kiếm danh sách khách hàng tiềm năng dựa trên tiêu chí ICP đã chốt tại `campaigns/<slug>/outputs/01_icp_criteria/icp_criteria.json`.

## 1. Phân nhánh tìm kiếm (Pick the Branch)
Dựa trên ICP của chiến dịch và loại hình sản phẩm trong `product-marketing.md`, xác định nhánh tiếp cận (một chiến dịch có thể kết hợp hai nhánh):

| Nhánh | Đối tượng hướng tới | Nguồn dữ liệu tối ưu |
| :--- | :--- | :--- |
| **SaaS & Tech** | Công ty công nghệ, phần mềm, digital | LinkedIn, Crunchbase, GitHub, ProductHunt, BuiltWith |
| **B2B Doanh nghiệp** | Doanh nghiệp sản xuất, xuất nhập khẩu, logistics, dịch vụ | LinkedIn Sales Navigator, Trang vàng, Danh bạ B2B |
| **Local SMB** | Doanh nghiệp địa phương (phòng khám, nhà hàng, bán lẻ, gym) | Google Maps, Facebook Pages, Website doanh nghiệp |
| **Demand-Signal** | Khách hàng đầu tiên có tín hiệu bức xúc / nhu cầu gấp | Nhóm cộng đồng thảo luận, bài đăng tuyển dụng, diễn đàn |

---

## 2. Đề xuất nguồn cho chiến dịch (bước 8, trước khi tìm khách)

Không mặc định LinkedIn hay bất kỳ nền tảng nào. Mỗi chiến dịch chọn nguồn riêng:

1. Đọc ICP của chiến dịch (`campaigns/<slug>/outputs/01_icp_criteria/`), `campaign.json` và `product-marketing.md`: ngành, quy mô, khu vực, chức danh người quyết định, tín hiệu mua.
2. Chọn nhánh ở bảng trên, đề xuất **2–3 nguồn xếp theo độ phù hợp**, mỗi nguồn một dòng: vì sao hợp với nhóm khách này, lấy được gì (tên công ty, người quyết định, email/SĐT, website), có cần đăng nhập không, rủi ro (khóa tài khoản, điều khoản nền tảng).
3. Hỏi: “1. <nguồn 1> (đề xuất). 2. <nguồn 2>. 3. <nguồn 3>. 4. Nguồn khác bạn đang dùng.” Hỏi thêm tài khoản người dùng đang có nếu nguồn cần đăng nhập.
4. Lưu lựa chọn vào `campaign.json` → `lead_sources` (theo thứ tự ưu tiên) và nói lại ngắn.

Ví dụ hướng chọn (không phải mặc định): phòng khám/nhà hàng/bán lẻ theo khu vực → Google Maps, Facebook Page; nhà máy, xuất nhập khẩu → danh bạ B2B, Trang vàng, website ngành; SaaS/công nghệ → LinkedIn, website công ty, tin tuyển dụng; nhu cầu gấp → nhóm cộng đồng, diễn đàn, tin tuyển dụng.

**Công cụ:** dùng CloakBrowser (`workflows/CLOAKBROWSER.md`) với hồ sơ trình duyệt của chiến dịch cho mọi nguồn web. `scripts/linkedin_prospector.py` chỉ là công cụ có sẵn cho LinkedIn, không phải lý do để chọn LinkedIn. Nguồn công khai không cần đăng nhập thì ưu tiên khi chất lượng tương đương.

## 3. Đăng nhập an toàn

- Nguồn cần đăng nhập: người dùng **tự đăng nhập** trong cửa sổ CloakBrowser của chiến dịch; phiên được giữ trong hồ sơ trình duyệt. Không xin mật khẩu, OTP, cookie hay token trong chat hoặc tệp `.env`.
- Khuyên dùng tài khoản phụ cho mạng xã hội; không dùng cùng một tài khoản ở hai chiến dịch chạy cùng lúc.
- Gặp xác minh, captcha hoặc chặn truy cập: dừng, báo người dùng, không cố vượt.

---

## 4. Ranh giới tuân thủ & An toàn (Compliance Guardrails)
1. **Không cào ồ ạt (No Bulk Scraping):** Giãn cách ngẫu nhiên 5-15 giây giữa các lượt quét.
2. **Lưu vết nguồn gốc (Data Lineage):** Mỗi lead phải ghi nhận URL nguồn và ngày thu thập để tuân thủ quy chuẩn liên hệ.
3. **Loại trừ trùng lặp (Deduplication):** Tự động lọc trùng theo Domain website hoặc Email/SĐT.

---

## 5. Đầu ra
Lưu danh sách lead vào `campaigns/<slug>/outputs/02_crawled_leads/leads_raw.json`.
Gợi ý danh sách Top 5 lead đạt điểm ICP cao nhất để người dùng ưu tiên tiếp cận đầu tiên.
