# Workflow tìm và chăm sóc khách hàng cho nhiều doanh nghiệp

## Môi trường mục tiêu

Người dùng sử dụng **Claude Code trong tab Code của Claude Desktop**, môi trường chạy trên máy (**This computer**, bản cũ ghi Local), chọn thư mục gốc workflow. Không dùng hướng dẫn Chat Projects hoặc cài `claude_desktop_config.json` như cơ chế mặc định của Code.

Bạn có thể đọc/ghi tệp và chạy lệnh theo công cụ, quyền và chính sách thực tế. Kiểm tra trước khi cài dependencies; giải thích ngắn khi cần quyền, báo kết quả thật. Các bước đăng nhập, mật khẩu/OTP hoặc thao tác ngoài quyền phải để người dùng làm trực tiếp. Không mặc định cần Node.js hoặc CLI để mở tab Code.

## Hướng dẫn vận hành

- **Dẫn dắt theo `workflows/USER_GUIDE_FLOW.md`**: chu trình 11 bước giống trang hướng dẫn, câu mở đầu, cách nhận diện câu mẫu và tên gọi khớp với trang hướng dẫn người dùng đã đọc. Người dùng đã tự tải workflow, tự đặt tài liệu vào `inputs` và mở thư mục bằng Code → This computer trước khi gặp bạn.
- Mở đầu mỗi phiên: kiểm tra `config/workflow_progress.md`, `inputs/`, `config/business.json`, `product-marketing.md` và `campaigns/` trước khi hỏi. Cập nhật `config/workflow_progress.md` (bước 1–6) hoặc `campaigns/<slug>/progress.md` (bước 7–10) sau mỗi giai đoạn và khi kết thúc phiên.
- **Chiến dịch và chạy song song theo `workflows/CAMPAIGNS.md`**: mỗi phiên làm một chiến dịch, chỉ ghi vào `campaigns/<slug>/`; đường dẫn `outputs/01…03` trong tài liệu khác hiểu là trong chiến dịch đang làm. Báo cáo tuần (`outputs/04_weekly_reports/`) tổng hợp mọi chiến dịch.
- Đọc `CLAUDE_PROJECT_INSTRUCTIONS.md` để biết chi tiết nghiệp vụ từng bước; quy tắc môi trường trong file CLAUDE.md này và `USER_GUIDE_FLOW.md` ưu tiên khi tài liệu cũ mâu thuẫn.
- Áp dụng `rules/nontechnical_user_experience.md`: hỏi từng câu đơn giản, lựa chọn đánh số, không yêu cầu người dùng tự biết phải hỏi gì.
- Tài liệu công ty ở `inputs/01_company_info/`, sản phẩm ở `inputs/02_marketing_materials/`. Người dùng tự đặt tài liệu; bạn đọc và báo tệp nào không trích xuất được.
- Skills project có ở `.claude/skills/`. Dữ liệu, ngữ cảnh và cấu hình riêng cho từng doanh nghiệp, không dùng dữ liệu doanh nghiệp khác.
- Kết nối TinaCRM theo `workflows/TINACRM_CONNECTION.md`; browser theo `workflows/CLOAKBROWSER.md`.
- Claude Code MCP dùng cấu hình project `.mcp.json`, connector hoặc CLI khi thực sự có sẵn. Filesystem MCP không bắt buộc để đọc project Local. Không ghi secret vào cấu hình được commit hoặc chat.
- Chưa gửi email, nhập lead hay tạo lịch trước khi các công cụ và phạm vi được thiết lập. Không coi script demo là nguồn lead thật.
