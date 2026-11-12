---
name: seo-article
description: Viết bài chuẩn SEO tiếng Việt cho website doanh nghiệp từ product-marketing.md, rồi đăng lên trang quản trị nội bộ bằng trình duyệt trong ứng dụng sau khi người dùng duyệt. Dùng khi người dùng nhờ viết hoặc đăng bài blog, tin tức, trang sản phẩm (workflow phụ, workflows/ADMIN_SITE.md).
metadata:
  version: 1.1.0
---

# Bài viết chuẩn SEO

Đọc `product-marketing.md` (sản phẩm, khách hàng, giọng văn) và `config/admin_site_notes.md` (nếu có) trước khi viết. Thao tác trên trang quản trị và ghi TinaCRM theo `workflows/ADMIN_SITE.md`.

## 0. Chủ đề từ TinaCRM

- Chưa có chủ đề: đề xuất từ dữ liệu khách trên TinaCRM (`topic-digest`, mục “Đề xuất chủ đề” trong `ADMIN_SITE.md`): câu hỏi và lý do chưa mua hay gặp trong ghi chú, task; ngành nhiều khách mà website chưa có bài; khách đã thành CUSTOMER (case study). Mỗi chủ đề nêu số liệu thật lấy từ kết quả lệnh.
- Bài trả lời câu hỏi thật của khách: dùng đúng cách khách hỏi làm H2 hoặc câu FAQ (viết lại cho gọn, không chép nguyên văn, không nêu tên khách).
- Case study: chỉ dùng tên khách, logo, số liệu dự án khi người dùng xác nhận khách đã đồng ý; không thì ẩn danh. Không đưa thông tin liên hệ, giá hợp đồng hay ghi chú nội bộ vào bài.

## 1. Chọn từ khóa

- Người dùng chưa có từ khóa: đề xuất 3 từ khóa theo ý định tìm kiếm của khách (tìm hiểu, so sánh, mua), mỗi từ khóa kèm một dòng lý do. Hỏi chọn.
- Tìm nhanh bằng công cụ tìm kiếm web có sẵn: 5 kết quả đầu cho từ khóa đó viết gì, thiếu gì. Bài phải trả lời câu hỏi đó tốt hơn, không chép.
- Không bịa số liệu tìm kiếm (lượt tìm/tháng, độ khó). Không có công cụ đo thì không nêu.

## 2. Cấu trúc bài

| Thành phần | Quy tắc |
|---|---|
| Tiêu đề SEO (title) | 50–60 ký tự, có từ khóa chính, càng gần đầu càng tốt |
| Mô tả meta | 140–160 ký tự, có từ khóa, nêu lợi ích, có lời mời hành động nhẹ |
| Slug | Không dấu, chữ thường, nối bằng gạch ngang, 3–6 từ, có từ khóa |
| H1 | Một H1 duy nhất (thường là tiêu đề bài), có thể dài hơn title |
| Mở đầu | 2–3 câu, có từ khóa trong 100 từ đầu, nói ngay bài giải quyết gì |
| Thân bài | H2/H3 theo câu hỏi khách hay hỏi; đoạn ngắn 2–4 câu; dùng danh sách, bảng khi so sánh |
| Từ khóa | Tự nhiên, khoảng 0,5–1,5%; dùng biến thể và từ liên quan, không nhồi |
| Liên kết | 2–3 liên kết nội bộ tới bài/trang sản phẩm có sẵn; 1–2 liên kết ngoài tới nguồn uy tín khi trích số liệu |
| Ảnh | Alt mô tả nội dung ảnh, có từ khóa khi hợp; tên tệp không dấu |
| Kết bài | Tóm tắt + một lời kêu gọi (liên hệ, dùng thử, đọc thêm) |
| FAQ | 3–5 câu hỏi ngắn khi hợp chủ đề |

Độ dài theo chủ đề: tin ngắn 600–900 từ, bài hướng dẫn/so sánh 1.200–2.000 từ. Không kéo dài cho đủ số.

## 3. Văn phong

- Viết cho khách đọc, không viết cho máy tìm kiếm. Mỗi đoạn phải có thông tin.
- Chỉ nêu điều có trong `product-marketing.md`, tài liệu trong `inputs/` hoặc nguồn có trích dẫn. Không bịa khách hàng, số liệu, giải thưởng, cam kết.
- Tránh văn AI: không mở bằng “Trong thời đại số…”, không “Hãy cùng tìm hiểu”, không lặp “không chỉ… mà còn”, không kết bằng “Tóm lại, … là vô cùng quan trọng”.

## 4. Kiểm tra trước khi xin duyệt

- [ ] Title, meta đúng độ dài (đếm ký tự thật).
- [ ] Từ khóa có trong title, H1, đoạn mở đầu, ít nhất một H2, slug, mô tả meta.
- [ ] Không trùng chủ đề với bài đã có trên trang (đã tìm ở trang quản trị).
- [ ] Liên kết nội bộ trỏ tới trang có thật.
- [ ] Không có thông tin không kiểm chứng được.

Lưu bản nháp ở `outputs/05_articles/<ngày>-<slug>.md`, đầu tệp là khối thông tin: `title`, `meta_description`, `slug`, `focus_keyword`, `category`, `tags`, `featured_image`, `crm_article_id` (id bản ghi “Bài viết” trên TinaCRM, nếu có). Hỏi duyệt bằng lựa chọn: “1. Đăng. 2. Sửa (nói chỗ cần sửa). 3. Để nháp, chưa đăng.” Chỉ đăng khi người dùng chọn Đăng.
