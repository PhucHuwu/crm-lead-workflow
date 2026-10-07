# QUY TẮC PHỎNG VẤN TƯƠNG TÁC (INTERACTIVE INTERVIEW RULES)

Tài liệu này quy định cách thức Claude tương tác và đặt câu hỏi cho người dùng trong suốt quá trình chạy quy trình CRM Lead Workflow trên Claude Desktop.

**Quy tắc ưu tiên:** `nontechnical_user_experience.md`. Các mẫu liệt kê nhiều thông tin kỹ thuật bên dưới chỉ là checklist nội bộ; khi hỏi người dùng phải chia thành từng lượt, một việc mỗi lượt, có lựa chọn trả lời đơn giản. Không yêu cầu secret trong chat. Không mặc định yêu cầu người dùng biết webhook hoặc API.

---

## 1. NGUYÊN TẮC "DỪNG LẠI ĐÚNG LÚC" (ZERO-ASSUMPTION POLICY)
- Claude **tuyệt đối không tự bịa đặt**:
  - Không tự bịa webhook URL (như `https://example-crm.com/webhook`).
  - Không tự bịa tài khoản/cookie người dùng.
  - Không tự ý quyết định nền tảng cào mà chưa hỏi ý kiến người dùng.
  - Không tự gửi email thật nếu người dùng chưa cung cấp phương thức gửi.
- Nếu thiếu bất kỳ tham số nào trong các bước B7, B8, B9, B10, B11, B12, B13, Claude **PHẢI** dừng phiên xử lý và đặt câu hỏi cho người dùng.

---

## 2. ĐỊNH DẠNG CÂU HỎI CHUẨN
Mỗi khi đặt câu hỏi cho người dùng, Claude phải tuân thủ cấu trúc 3 phần:

### Phần 1: Bối cảnh ngắn gọn (Why)
Giải thích tại sao cần thông tin này trong 1-2 câu.

### Phần 2: Câu hỏi cụ thể (What)
Liệt kê các mục cần người dùng cung cấp dưới dạng gạch đầu dòng rõ ràng. Kèm ví dụ cụ thể để người dùng dễ điền.

### Phần 3: Gợi ý phương án sẵn có (Options)
Cung cấp sẵn các lựa chọn đánh số `1.`, `2.`, `3.` để người dùng có thể chỉ cần gõ số lựa chọn nếu không muốn gõ dài.

---

## 3. VÍ DỤ MẪU TƯƠNG TÁC

### Mẫu hỏi Webhook CRM (Bước 9):
> 🎯 **[BƯỚC 9/13: KẾT NỐI CRM QUA WEBHOOK]**
> 
> Để tôi có thể tự động đẩy các lead đạt chuẩn vào CRM của bạn, tôi cần thông tin cổng tiếp nhận:
> 
> 1. **Webhook URL** của hệ thống CRM của bạn (Ví dụ: Lark Base, HubSpot, Make, n8n, Google Sheets Webhook...).
> 2. **Loại CRM** bạn đang sử dụng.
> 3. **API Key hoặc Bearer Token** (nếu CRM yêu cầu xác thực bảo mật).
> 
> *Bạn có thể gửi trực tiếp link webhook vào đây, hoặc gõ `hướng dẫn` nếu bạn chưa biết cách tạo webhook trên CRM của mình.*
