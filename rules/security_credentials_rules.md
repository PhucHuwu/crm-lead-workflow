# QUY TẮC BẢO MẬT TÀI KHOẢN VÀ DỮ LIỆU (SECURITY & CREDENTIALS RULES)

Tài liệu này đặt ra các ranh giới bảo mật nghiêm ngặt khi xử lý tài khoản cá nhân của người dùng và thông tin Webhook.

---

## 1. NGUYÊN TẮC BẢO VỆ TÀI KHOẢN CÁ NHÂN (BƯỚC 8)
1. **Tuyệt đối không lưu mật khẩu thô (Plaintext Passwords):**
   - Không yêu cầu người dùng paste trực tiếp mật khẩu tài khoản mạng xã hội vào chat.
   - Hướng dẫn người dùng xuất **Session Cookie** (ví dụ: cookie `li_at` đối với LinkedIn, `c_user` + `xs` đối với Facebook).
2. **Khuyến nghị tài khoản phụ (Secondary Accounts):**
   - Luôn cảnh báo người dùng sử dụng tài khoản chuyên dụng cho marketing/scraping, không dùng tài khoản cá nhân chính chủ có chứa thông tin nhạy cảm.
3. **Lưu trữ biến môi trường cục bộ:**
   - Hướng dẫn người dùng cấu hình credentials vào file `.env` nằm trong máy tính người dùng (`config/.env`).
   - File `.env` phải được thêm vào `.gitignore` để không bao giờ bị lộ ra ngoài.

---

## 2. NGUYÊN TẮC BẢO MẬT WEBHOOK & API KEY (BƯỚC 9, BƯỚC 12)
1. **Kiểm tra URL hợp lệ:**
   - Webhook URL phải bắt đầu bằng giao thức bảo mật `https://`.
2. **Che giấu Secret trong log và báo cáo:**
   - Các Header Authorization như Bearer Token hoặc API Key chỉ hiển thị dạng masked trong báo cáo (ví dụ: `sk_live_...4a9f`).
3. **Kiểm thử trước khi chạy (Dry Run):**
   - Bắt buộc gửi một payload thử nghiệm duy nhất có cờ `"is_test": true` và yêu cầu người dùng xác nhận trước khi gửi toàn bộ cơ sở dữ liệu lead.
