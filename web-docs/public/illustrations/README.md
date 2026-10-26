# Nguồn hình hướng dẫn




- `github-download.png`: ảnh chụp trang kho GitHub Tinasoft-Viet-Nam/TinaCRM-Agent (menu Code mở), chụp 2026-10-26 bằng Playwright, không phải giao diện Claude.
- `folder-map.svg`, `copy-files.svg`, `unzip.svg`, `email-flow.svg`: sơ đồ thao tác/nghiệp vụ, không phải screenshot hệ điều hành hay ứng dụng.
- `code-local.svg`: sơ đồ thao tác Code → Local → Select folder, đối chiếu tài liệu https://code.claude.com/docs/en/desktop-quickstart. Không phải ảnh chụp Claude Code.
- Các ảnh Chat Projects/Add to project hoặc trang download không được dùng làm hình đối chiếu giao diện Code.

- `claude-code-folder-chosen-full.png`: toàn bộ cửa sổ Claude Desktop (Mac) tab Code sau khi chọn thư mục, chụp 2026-10-19. Đã xóa tên tài khoản góc dưới trái.
- `claude-code-open-folder-zoom.png`: phần dưới cửa sổ, menu chọn thư mục mở từ nút Choose…, chụp 2026-10-19. Đã xóa tên các dự án khác trong mục Recent, chỉ giữ crm-lead-workflow.
- `claude-code-permissions-zoom.png`: phần dưới cửa sổ, menu Permissions mở từ nút Manual với 5 chế độ, chụp 2026-10-19.
- `claude-account-menu.png`: góc dưới trái Claude Desktop, menu tài khoản có Usage, chụp 2026-10-19. Đã xóa email và tên tài khoản.
- `tinacrm-api-keys.png`, `tinacrm-api-key-form.png`, `tinacrm-api-key-created.png`: TinaCRM Settings → MCP & APIs → API, tạo khóa thử, chụp 2026-10-19 trên Edge. Đã cắt thanh trình duyệt (địa chỉ workspace) và che hoàn toàn chuỗi khóa.
- `tinacrm-key-dialog.png`: hộp thoại do scripts/tinacrm_save_key.sh bật lên, chụp 2026-10-19.
- Bản giao diện sáng `*-light.png` của 4 ảnh Claude Desktop trên (`claude-code-folder-chosen-full-light.png`, `claude-code-open-folder-zoom-light.png`, `claude-code-permissions-zoom-light.png`, `claude-account-menu-light.png`): chụp 2026-10-19, cùng vùng cắt với bản tối để dùng chung vị trí đánh dấu. Trang tự đổi ảnh theo giao diện sáng/tối (`srcLight` trong `src/lib/visuals.ts`). Đã xóa tên tài khoản, email và các dự án khác trong mục Recent.
- `tinacrm-api-keys-light.png`, `tinacrm-api-key-form-light.png`: bản giao diện sáng của hai ảnh TinaCRM, chụp 2026-10-19 trên Edge, cùng vùng cắt (đã bỏ thanh trình duyệt). Đã che dòng khóa `test` trong danh sách. Ảnh danh sách khóa có bố cục khác bản tối nên dùng vị trí đánh dấu riêng (`markersLight`).
- `claude-connector-card.png`, `claude-connector-card-light.png`: thẻ Suggested connectors (Gmail, nút Connect) Claude hiện trong khung chat tab Code, chụp 2026-10-21, bản tối và sáng cùng vùng cắt. Không có thông tin tài khoản.
- `tinacrm-api-key-created-light.png`: bản giao diện sáng của màn hình khóa vừa tạo, chụp 2026-10-19 bằng khóa thử `docs-screenshot` (hạn 30 ngày) đã xóa ngay sau khi chụp. Chuỗi khóa được che trước khi lưu ảnh.
