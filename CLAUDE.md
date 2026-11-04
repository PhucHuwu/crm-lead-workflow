@AGENTS.md

## Riêng cho Claude Code

- Chỉ dẫn chính nằm ở `AGENTS.md` (dùng chung với Codex). Sửa ở đó, không sửa ở đây.
- Skills: dùng `.claude/skills/`, là bản sao của `.agents/skills/` do `python3 scripts/sync_skills.py` tạo.
- Có công cụ hỏi lựa chọn thì dùng cho các câu hỏi đánh số; nội dung lựa chọn giữ nguyên như trong tài liệu.
- Không thêm máy chủ MCP vào `.mcp.json`; trình duyệt và ThongtinCty là lệnh `scripts/`. Gmail, Calendar, Apollo… dùng thẻ Connect trong phiên đang mở theo `workflows/CONNECTORS.md` mục “Claude Code”. Không nhờ người dùng mở phiên mới.
- Quyền chạy lệnh và đặt lịch: phần “Claude Code” trong `workflows/ASSISTANT_SETUP.md` và `workflows/SCHEDULING.md`.
