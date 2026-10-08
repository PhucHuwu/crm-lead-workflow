# Sổ tay Workflow — Next.js

Website tài liệu tiếng Việt cho người dùng ít quen công nghệ. Nội dung dùng chung cho nhiều doanh nghiệp, không đọc hồ sơ hoặc dữ liệu lead riêng trong repository.

## Chạy local

Yêu cầu Node.js >= 20.9 và npm. Chạy trong thư mục `web-docs`:

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Build production:

```bash
npm run build
npm start
```

## Nội dung và chức năng

- 13 bài, dùng Claude Code trong Desktop: Code → Local → Select folder. Claude có thể đọc/ghi và chạy lệnh theo quyền; người dùng tự đặt tài liệu và đăng nhập. Mở tab Code không yêu cầu cài Node.js/CLI riêng.
- Tìm kiếm tiếng Việt có hoặc không dấu; phím tắt Ctrl/Cmd+K.
- Câu mẫu sao chép vào Claude, checklist và đánh dấu đã đọc lưu trong localStorage của trình duyệt.
- Điều hướng từng bài, mục lục, chế độ sáng/tối, giao diện mobile và hỗ trợ in.
- Tiến độ chỉ lưu trên thiết bị, không đồng bộ TinaCRM và không xác nhận công cụ đã kết nối.

Sửa nội dung tại `src/lib/guides.ts`. Trang này là hướng dẫn, không phải ứng dụng điều khiển Claude, CRM hoặc gửi email. Phần cài công cụ lần đầu được trình bày như việc cần người hỗ trợ.
