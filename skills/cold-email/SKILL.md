---
name: cold-email
description: Xây dựng kịch bản email chăm sóc theo chu trình (Cadence Routine), cá nhân hóa nội dung cho từng lead và loại bỏ triệt để văn phong robot của AI. Sử dụng ở Bước 10 và Bước 11 của quy trình.
metadata:
  version: 2.0.0
---

# Cold Email Cadence & Nurturing

Kỹ năng này chịu trách nhiệm xây dựng chuỗi email chăm sóc đa điểm chạm (Cadence Routine) cho danh sách lead cào được từ Bước 8, sử dụng ngữ cảnh từ `product-marketing.md`.

## 1. Triết lý hành văn: "Viết như một đồng nghiệp, không phải người bán hàng"
- **Ngắn gọn & Trực diện:** Mỗi câu văn phải có giá trị. Nếu một câu có thể cắt bỏ mà không làm mất nghĩa, hãy cắt.
- **Tập trung vào khách hàng:** Tỷ lệ từ "Bạn / Doanh nghiệp của bạn" phải áp đảo từ "Tôi / Công ty chúng tôi".
- **Một lời kêu gọi hành động (Single Ask, Low Friction):** Không đòi hỏi cuộc họp 30-45 phút ở email đầu tiên. Dùng câu hỏi đo lường mức độ quan tâm (*"Bạn có muốn tôi gửi tài liệu phân tích nhanh không?"*).

---

## 2. Bộ quy tắc Chống văn phong AI (Anti-AI Tells Blacklist)
**TUYỆT ĐỐI KHÔNG SỬ DỤNG các mẫu câu sáo rỗng sau:**
- ❌ *"Hy vọng email này tìm thấy bạn trong trạng thái tốt lành"* (I hope this email finds you well).
- ❌ *"Trong kỷ nguyên công nghệ số bùng nổ hiện nay..."*
- ❌ Cấu trúc đối lập máy móc: *"Đây không phải là giải pháp X, mà là giải pháp Y..."*
- ❌ Từ ngữ đao to búa lớn: *"Khai phá tiềm năng"*, *"Tối ưu hóa toàn diện"*, *"Đẳng cấp hàng đầu"*, *"Đột phá"*.
- ❌ Dấu gạch ngang dài (`—`) lạm dụng giữa các vế câu.

---

## 3. Khung chuỗi chăm sóc 4 điểm chạm (Cadence Routine - Bước 10)
- **Touch 1 (Ngày 0) — Quan sát & Điểm đau:** Nhắc đến một tín hiệu thực tế của doanh nghiệp họ ➔ Nêu bài toán ngành ➔ Gợi mở giải pháp.
- **Touch 2 (Ngày 3) — Bằng chứng thực tế (Proof):** Một câu chuyện thành công của doanh nghiệp tương đồng kèm số liệu đo lường.
- **Touch 3 (Ngày 7) — Lời mời giá trị gia tăng:** Tặng tài liệu nghiên cứu chuyên sâu hoặc lời mời demo 10 phút.
- **Touch 4 (Ngày 12) — Breakup Email:** Thông báo lịch sự về việc ngừng gửi email để không làm phiền, để lại kênh liên hệ nếu họ cần trong tương lai.

---

## 4. Checkpoint hỏi người dùng (Bước 11)
- *"Bạn muốn triển khai gửi email chuỗi này qua phương thức nào?"*
  1. *Gửi qua tài khoản Gmail / Google Workspace*
  2. *Gửi qua SMTP server riêng của doanh nghiệp*
  3. *Gửi qua dịch vụ API (Resend / SendGrid)*
  4. *Xuất file email cá nhân hóa để bạn duyệt và gửi thủ công từng người*
- Xuất danh sách email đã cá nhân hóa vào thư mục `outputs/03_email_cadence/`.
