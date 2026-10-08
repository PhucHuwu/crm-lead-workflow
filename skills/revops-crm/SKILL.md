---
name: revops-crm
description: Quản lý vòng đời lead, gọi webhook đồng bộ lead lên CRM (Bước 9) và tự động tạo Task CSKH hoặc cập nhật trạng thái khi khách hàng phản hồi (Bước 12).
metadata:
  version: 2.0.0
---

# RevOps & CRM Webhook Orchestration

## TinaCRM: quy tắc kết nối ưu tiên

Đọc `workflows/TINACRM_CONNECTION.md` trước các ví dụ bên dưới. Ưu tiên native MCP `/mcp`, khám phá tools/schema và quyền thực tế. REST/MCP cần xác thực; API key dùng Bearer, Role và workspace đã gắn trong token, không yêu cầu người dùng nhập workspace ID riêng. Webhook thông báo không phải cổng nhập lead; workflow trigger phải được thiết lập riêng. Payload `action` bên dưới chỉ là minh họa, không phải API chuẩn TinaCRM. Kết quả khởi chạy workflow chưa chứng minh dữ liệu đã được lưu; cần đọc lại.

Kỹ năng này điều phối vòng đời của khách hàng tiềm năng giữa Claude và hệ thống CRM thông qua Webhook HTTP.

## 1. Vòng đời dữ liệu Lead (Lifecycle Stages)
1. `PROSPECT` ➔ Lead vừa cào được từ Bước 8.
2. `IN_OUTREACH` ➔ Lead đang trong chuỗi email chăm sóc (Bước 10-11).
3. `ENGAGED / REPLIED` ➔ Khách hàng phản hồi email ➔ **Tạo Task CSKH ưu tiên cao**.
4. `UNRESPONSIVE` ➔ Kết thúc chuỗi email nhưng không trả lời ➔ **Đánh dấu hủy chăm sóc**.

---

## 2. Checkpoints hỏi người dùng bắt buộc

### Tại Bước 9 (Đẩy Lead lên CRM):
Hỏi thông số webhook:
1. *"Webhook URL tiếp nhận dữ liệu Lead mới của CRM bạn là gì?"*
2. *"Loại CRM bạn đang dùng (Lark Base, HubSpot, Google Sheets Webhook, Bitrix24, Odoo...)?"*
3. *"Có Header bảo mật (Bearer Token / API Key) nào đi kèm không?"*
*Gửi thử 1 lead test (`is_test: true`) để người dùng xác nhận trước khi đẩy toàn bộ.*

### Tại Bước 12 (Tạo Task khi khách phản hồi):
1. *"Khách hàng [Tên khách hàng] vừa phản hồi! Vui lòng cung cấp Webhook tạo Task trên CRM (hoặc xác nhận dùng webhook chung với Bước 9)."*
2. *"Email hoặc ID nhân viên/đội ngũ CSKH nhận phân công task này là ai?"*

---

## 3. Cấu trúc Payload chuẩn hóa

### Payload Lead (Bước 9):
```json
{
  "action": "create_or_update_lead",
  "data": {
    "source": "Claude Auto Pipeline",
    "full_name": "Nguyễn Văn A",
    "job_title": "Giám đốc Vận hành",
    "company_name": "Công ty ABC",
    "email": "a.nguyen@abc.com",
    "phone": "+84912345678",
    "lead_score": 88,
    "status": "In Outreach"
  }
}
```

### Payload Task CSKH (Bước 12):
```json
{
  "action": "create_cskh_task",
  "data": {
    "task_title": "HOT LEAD: Phản hồi chăm sóc từ [Tên công ty]",
    "priority": "HIGH",
    "assigned_to": "sales_team@company.com",
    "notes": "Khách hàng muốn trao đổi thêm về giải pháp"
  }
}
```
