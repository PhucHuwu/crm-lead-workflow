---
name: weekly-reporting
description: Định kỳ tổng hợp các chỉ số chuyển đổi, tình trạng lead, tỷ lệ phản hồi email và tự động gửi email báo cáo hàng tuần cho ban quản trị. Sử dụng ở Bước 13 của quy trình.
metadata:
  version: 2.0.0
---

# Weekly Reporting & Performance Loop

Kỹ năng này đóng vai trò chốt chu trình (Loop Closer), đo lường toàn bộ hiệu suất từ lúc cào lead đến lúc ra chuyển đổi, và gửi báo cáo định kỳ về hộp thư của người dùng.

## 1. Các chỉ số cốt lõi (Core Funnel Metrics)
1. **Phễu cào Lead:** Tổng lead cào được ➔ Số lượng đạt chuẩn ICP (ICP Rate %).
2. **Phễu tiếp cận Email:** Số email đã gửi ➔ Tỷ lệ mở (Open Rate) ➔ Tỷ lệ phản hồi (Reply Rate %).
3. **Phễu bán hàng (CRM Tasks):** Số lượng Task CSKH được kích hoạt ➔ Số lead hủy chăm sóc (Unresponsive).
4. **Insight chất lượng:** Trích xuất các phản hồi tích cực và lý do phản đối chính để cải thiện chu trình sau.

---

## 2. Checkpoints hỏi người dùng (Bước 13)
- *"Hệ thống đã chuẩn bị xong khuôn mẫu báo cáo tuần. Vui lòng cho biết:*
  1. *Địa chỉ email nhận báo cáo của bạn.*
  2. *Thời điểm gửi mong muốn (Ví dụ: 08:30 sáng Thứ Hai hàng tuần).*"

---

## 3. Đầu ra
- Tạo báo cáo định dạng Markdown và HTML lưu tại: `outputs/04_weekly_reports/weekly_report_YYYY-WW.md`.
- Kích hoạt gửi email báo cáo tới địa chỉ người dùng đã đăng ký.
