# Luồng dẫn dắt khớp với trang hướng dẫn

Trang hướng dẫn (`web-docs/`) trình bày **một chu trình duy nhất gồm 11 bước**. Claude dẫn dắt đúng thứ tự, đúng số bước và tên bước đó để người dùng luôn biết mình đang ở đâu. Tệp này ưu tiên hơn thứ tự “13 bước” trong tài liệu cũ khi nói chuyện với người dùng; 13 bước chỉ là checklist kỹ thuật nội bộ.

## Chu trình 11 bước

| Bước | Tên trên trang | Ai làm | Claude làm | Xong khi |
|---|---|---|---|---|
| 1 | Tải workflow | Người dùng | — | Đã giải nén, có `inputs`, `outputs`, `CLAUDE.md`. |
| 2 | Đặt tài liệu vào inputs | Người dùng | — (nếu trống, chỉ đường bằng Finder/File Explorer; không tự sao chép tệp) | Tài liệu nằm trong `inputs/01_company_info/`, `inputs/02_marketing_materials/`. |
| 3 | Mở bằng Claude Code | Người dùng | — | Đang ở tab Code, thanh dưới ô nhập hiện This computer + tên thư mục workflow + Manual. |
| 4 | Claude đọc tài liệu | Claude | Đọc `CLAUDE.md` + `inputs`, báo tệp đọc được/không, tóm tắt doanh nghiệp, hỏi phần thiếu, viết `product-marketing.md`, tạo `config/business.json` từ mẫu, hỏi sản phẩm ưu tiên. | Người dùng xác nhận tóm tắt và chọn sản phẩm ưu tiên. |
| 5 | Claude kiểm tra môi trường | Claude | Kiểm tra Python/công cụ có sẵn, giải thích ngắn, cài CloakBrowser theo `CLOAKBROWSER.md` khi được cho phép. | Kết quả kiểm tra thật cho thấy đủ môi trường. |
| 6 | Claude kết nối công cụ | Claude | Thêm `workflow-cloakbrowser` vào `.mcp.json`, nhắc mở lại session, mở thử trang công khai. Kết nối TinaCRM theo `TINACRM_CONNECTION.md`: hỏi địa chỉ, hướng dẫn đăng nhập, đọc thử schema, không ghi dữ liệu. | CloakBrowser mở được trang; đọc thử được đúng workspace TinaCRM. |
| 7 | Xác định khách phù hợp | Claude | Đề xuất khách phù hợp + thị trường, hỏi chọn từng phần, lưu `outputs/01_icp_criteria/`. | Người dùng duyệt tiêu chí, đã lưu tệp. |
| 8 | Tìm khách & lưu CRM | Claude | Hỏi nguồn (tài khoản đang có) và mục tiêu/ngày; tìm danh sách nhỏ (lưu `outputs/02_crawled_leads/`); người dùng tự đăng nhập trong CloakBrowser; kiểm tra trùng rồi lưu TinaCRM. | Danh sách được duyệt; số tạo mới/cập nhật/bỏ qua/lỗi là kết quả thật. |
| 9 | Email chăm sóc | Claude | Hỏi loại hộp thư → địa chỉ, hướng dẫn kết nối; đề xuất chuỗi email (lưu `outputs/03_email_cadence/`), cho xem mẫu. | Hộp thư đã kết nối; người dùng duyệt kế hoạch và phạm vi gửi. |
| 10 | Chạy hằng ngày | Claude | Phản hồi mới → tìm khách theo mục tiêu → email đến hạn. Kiểm tra lịch chạy thật trước khi hứa. Cuối phiên tóm tắt và lưu tiến trình. | Có tóm tắt phiên, tiến trình được cập nhật. |
| 11 | Báo cáo tuần | Claude | Hỏi người nhận → ngày → giờ; cho xem bản nháp (lưu `outputs/04_weekly_reports/`); đề xuất một điều chỉnh. | Mẫu báo cáo được duyệt. |

Sau bước 11, chu trình lặp lại từ bước 10. Ánh xạ nội bộ: bước 4 = B1–B5, bước 7 = B6, bước 8 = B7–B9, bước 9 = B10–B12, bước 11 = B13.

Quy tắc chung: hỏi từng câu, lựa chọn đánh số; chỉ sang bước sau khi đạt “Xong khi”. Người dùng có thể chọn “Để sau” — ghi rõ bước đó chưa xong và không chạy bước phụ thuộc vào nó (ví dụ bước 8 cần bước 6 để lưu CRM).

## Luôn nói số bước

- Khi bắt đầu hoặc chuyển bước, nói ngắn: “Xong **bước 4**. Tiếp theo là **bước 5 – kiểm tra môi trường**.”
- Cuối mỗi bước, gợi ý người dùng gửi câu mẫu của bước tiếp theo, hoặc hỏi “1. Làm tiếp bước N. 2. Để sau.”
- Không đọc nguyên 11 bước trừ khi người dùng hỏi.

## Nhận diện câu mẫu trên trang

Người dùng thường dán nguyên câu mẫu. Nhận diện bước và chỉ làm trong phạm vi câu đó (“Chưa gửi thật”, “Chưa tạo, sửa hay xóa dữ liệu”, “Giải thích trước khi cài”).

| Câu mẫu bắt đầu bằng… | Bước |
|---|---|
| “Đọc CLAUDE.md và tài liệu trong inputs…” | 4 |
| “Kiểm tra môi trường cho workflow này…” | 5 |
| “Kết nối CloakBrowser qua .mcp.json…”, “Kết nối TinaCRM qua MCP…” (người dùng đã có API key; làm theo mục “Thiết lập MCP với API key” trong `TINACRM_CONNECTION.md`: chạy `scripts/tinacrm_save_key.sh` để bật hộp thoại cho người dùng dán khóa, không nhận khóa qua chat) | 6 |
| “Đề xuất tiêu chí khách hàng phù hợp (ICP)…” | 7 |
| “Tìm 10 khách theo ICP đã chốt…”, “Kiểm tra trùng và lưu danh sách đã duyệt vào TinaCRM…” | 8 |
| “Kết nối hộp thư…”, “Đề xuất chuỗi email chăm sóc…” | 9 |
| “Tiếp tục chiến dịch…”, “Tiếp tục từ lần trước” | 10 |
| “Thiết lập báo cáo hằng tuần…” | 11 |

Câu lệnh trên trang được viết ngắn cho người dùng. Vẫn áp dụng đầy đủ quy tắc an toàn: hỏi từng câu, giải thích ngắn trước khi cài, không ghi CRM khi câu lệnh chỉ yêu cầu đọc thử, không gửi email thật trước khi người dùng duyệt, không xin mật khẩu/khóa trong chat.

Nếu người dùng nhảy cóc, nói ngắn bước nào còn thiếu và hỏi: “1. Làm bước N trước. 2. Vẫn tiếp tục với thông tin hiện có.”

## Mở đầu phiên

Trước khi nói, kiểm tra `config/workflow_progress.md`, `inputs/`, `config/business.json`, `product-marketing.md`.

- **Có tiến trình:** tóm tắt tối đa ba dòng, rồi hỏi “1. Tiếp tục bước N – <tên>. 2. Chạy hằng ngày (bước 10). 3. Việc khác.”
- **Lần đầu, có tài liệu:** làm bước 4 ngay.
- **Lần đầu, `inputs` trống:** hỏi “1. Tôi tự đặt tài liệu vào thư mục (bước 2) — chỉ đường giúp tôi. 2. Tôi gửi website. 3. Hỏi tôi từng câu.” Nếu chọn 1, hướng dẫn mở Finder/File Explorer → thư mục workflow → `inputs` → thư mục tương ứng, sao chép và dán, rồi hỏi “Bạn dán xong chưa? 1. Rồi. 2. Chưa được.”

Nếu tài liệu nằm ngoài thư mục workflow, nhờ người dùng tự đặt vào `inputs`; không tự sao chép.

## Gọi tên theo màn hình người dùng thấy

Dùng tên nút như trên màn hình hiện tại: Code (biểu tượng `</>`), This computer, Choose… (nút chọn thư mục; bản cũ ghi No folder), Open folder…, Manual, Usage, Settings → MCP & APIs. Không nói “session”, “repository”, “MCP server”, “worktree” trừ khi người dùng hỏi. Trước khi ứng dụng hỏi quyền, nói: “Sắp tới ứng dụng sẽ hỏi quyền để [việc]. Bạn bấm cho phép nếu đúng như vậy.” Không đề nghị Bypass permissions. Nếu màn hình khác mô tả, hỏi người dùng đang thấy gì, không bịa tên nút.

## Lưu tiến trình

Ghi `config/workflow_progress.md` (không commit, không chứa secret) sau mỗi bước và khi kết thúc phiên:

```markdown
# Tiến trình — <tên doanh nghiệp>
Cập nhật: <ngày giờ>
- [x] Bước 4 Claude đọc tài liệu — <ghi chú>
- [ ] Bước 5 Kiểm tra môi trường — <trạng thái thật>
- [ ] Bước 6 Kết nối công cụ — CloakBrowser: …; TinaCRM: …
...
Đang chờ người dùng: <việc>
Bước tiếp theo: Bước N – <tên>
```

Chỉ đánh dấu xong khi đạt “Xong khi” bằng kết quả công cụ thật.
