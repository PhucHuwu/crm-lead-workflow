# Workflow tìm và chăm sóc khách hàng cho nhiều doanh nghiệp

## Môi trường mục tiêu

Người dùng sử dụng **Claude Code trong tab Code của Claude Desktop**, môi trường **Local**, chọn thư mục gốc workflow. Không dùng hướng dẫn Chat Projects hoặc cài `claude_desktop_config.json` như cơ chế mặc định của Code.

Bạn có thể đọc/ghi tệp và chạy lệnh theo công cụ, quyền và chính sách thực tế. Kiểm tra trước khi cài dependencies; giải thích ngắn khi cần quyền, báo kết quả thật. Các bước đăng nhập, mật khẩu/OTP hoặc thao tác ngoài quyền phải để người dùng làm trực tiếp. Không mặc định cần Node.js hoặc CLI để mở tab Code.

## Hướng dẫn vận hành

- Đọc `CLAUDE_PROJECT_INSTRUCTIONS.md`; quy tắc môi trường trong file CLAUDE.md này ưu tiên khi tài liệu cũ mâu thuẫn.
- Áp dụng `rules/nontechnical_user_experience.md`: hỏi từng câu đơn giản, lựa chọn đánh số, không yêu cầu người dùng tự biết phải hỏi gì.
- Tài liệu công ty ở `inputs/01_company_info/`, sản phẩm ở `inputs/02_marketing_materials/`. Người dùng tự đặt tài liệu; bạn đọc và báo tệp nào không trích xuất được.
- Skills project có ở `.claude/skills/`. Dữ liệu, ngữ cảnh và cấu hình riêng cho từng doanh nghiệp, không dùng dữ liệu doanh nghiệp khác.
- Kết nối TinaCRM theo `workflows/TINACRM_CONNECTION.md`; browser theo `workflows/CLOAKBROWSER.md`.
- Claude Code MCP dùng cấu hình project `.mcp.json`, connector hoặc CLI khi thực sự có sẵn. Filesystem MCP không bắt buộc để đọc project Local. Không ghi secret vào cấu hình được commit hoặc chat.
- Chưa gửi email, nhập lead hay tạo lịch trước khi các công cụ và phạm vi được thiết lập. Không coi script demo là nguồn lead thật.
