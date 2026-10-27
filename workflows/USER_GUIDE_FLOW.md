# Luồng dẫn dắt khớp với trang hướng dẫn

Trang hướng dẫn (https://crm-lead-workflow.vercel.app, repo TinaCRM-Agent-Docs) trình bày **một chu trình duy nhất gồm 11 bước**. Trợ lý (Claude Code hoặc Codex) dẫn dắt đúng thứ tự, đúng số bước và tên bước đó để người dùng luôn biết mình đang ở đâu. Tệp này ưu tiên hơn thứ tự “13 bước” trong tài liệu cũ khi nói chuyện với người dùng; 13 bước chỉ là checklist kỹ thuật nội bộ.

## Chu trình 11 bước

Trang chia 11 bước thành 3 phần, dùng đúng tên này khi nói với người dùng:

- **Thiết lập lần đầu** (bước 1–6): một lần cho mỗi doanh nghiệp.
- **Tạo chiến dịch** (bước 7–9): chiến dịch đầu tiên và mỗi chiến dịch mới.
- **Dùng hằng ngày** (bước 10–11): sau khi thiết lập, chỉ cần phần này; trợ lý có thể đặt lịch tự chạy.

| Bước | Tên trên trang | Ai làm | Trợ lý làm | Xong khi |
|---|---|---|---|---|
| 1 | Tải workflow | Người dùng | — | Đã giải nén, có `inputs`, `outputs`, `AGENTS.md`. |
| 2 | Đặt tài liệu vào inputs | Người dùng | — (nếu trống, chỉ đường bằng Finder/File Explorer; không tự sao chép tệp) | Tài liệu nằm trong `inputs/01_company_info/`, `inputs/02_marketing_materials/`. |
| 3 | Mở bằng trợ lý AI | Người dùng | Theo `ASSISTANT_SETUP.md`: chỉ chỗ bấm cho Claude Code hoặc Codex, cấp quyền chạy lệnh `scripts/`; lưu `assistant` vào `config/business.json` ở bước 4. | Claude: tab Code, thanh dưới ô nhập hiện This computer + tên thư mục workflow + Manual. Codex: cuộc trò chuyện Local đúng thư mục workflow, đã tin cậy thư mục. |
| 4 | Trợ lý đọc tài liệu | Trợ lý | Đọc `AGENTS.md` + `inputs`, báo tệp đọc được/không, tóm tắt doanh nghiệp, hỏi phần thiếu, viết `product-marketing.md`, tạo `config/business.json` từ mẫu, hỏi sản phẩm ưu tiên. | Người dùng xác nhận tóm tắt và chọn sản phẩm ưu tiên. |
| 5 | Trợ lý kiểm tra môi trường | Trợ lý | Kiểm tra Python/công cụ có sẵn, giải thích ngắn, cài CloakBrowser theo `CLOAKBROWSER.md` khi được cho phép. | Kết quả kiểm tra thật cho thấy đủ môi trường. |
| 6 | Trợ lý kết nối công cụ | Trợ lý | Thêm `workflow-cloakbrowser` vào cấu hình MCP (Claude: `.mcp.json`; Codex: `.codex/config.toml`) theo `CLOAKBROWSER.md`, nhắc mở phiên mới, mở thử trang công khai. Kết nối TinaCRM qua REST theo `TINACRM_CONNECTION.md` (không dùng MCP cho TinaCRM): hỏi địa chỉ, bật hộp thoại lưu khóa, `scripts/tinacrm_rest.py check` và đọc thử, không ghi dữ liệu. Sau đó đề xuất connector các bước sau sẽ cần (Gmail/Outlook, Google Calendar, Apollo…) theo `CONNECTORS.md`: Claude hiện thẻ Connect trong chat; Codex hướng dẫn bật plugin ở tab Plugins; người dùng đăng nhập nếu cần. Khách Việt Nam thì trợ lý tự thêm ThongtinCty vào cấu hình MCP. Kiểm tra bằng thao tác đọc. | CloakBrowser mở được trang; đọc thử được đúng workspace TinaCRM; connector đã chọn đọc thử được (hoặc người dùng chọn để sau). |
| 7 | Xác định khách phù hợp | Trợ lý | Hỏi tên chiến dịch (nhóm khách hoặc sản phẩm), tạo `campaigns/<slug>/` theo `CAMPAIGNS.md`. Đề xuất khách phù hợp + thị trường, hỏi chọn từng phần, lưu `campaigns/<slug>/outputs/01_icp_criteria/`. | Người dùng duyệt tiêu chí, đã lưu tệp. |
| 8 | Tìm khách & lưu CRM | Trợ lý | Nếu `campaign.json` → `lead_sources` còn trống: phân tích ICP của chiến dịch, đề xuất 2–3 nguồn xếp theo độ phù hợp (lý do, dữ liệu lấy được, cần đăng nhập không, rủi ro), người dùng chọn, lưu `lead_sources`; không mặc định LinkedIn (chi tiết: skill prospecting). Hỏi mục tiêu/ngày; tìm danh sách nhỏ (lưu `campaigns/<slug>/outputs/02_crawled_leads/`); người dùng tự đăng nhập trong CloakBrowser; kiểm tra trùng rồi lưu TinaCRM qua `scripts/tinacrm_rest.py`. | Danh sách được duyệt; số tạo mới/cập nhật/bỏ qua/lỗi là kết quả thật. |
| 9 | Email chăm sóc | Trợ lý | Hộp thư chưa kết nối ở bước 6 thì hỏi loại hộp thư → địa chỉ, kết nối theo `CONNECTORS.md`; đề xuất chuỗi email (lưu `campaigns/<slug>/outputs/03_email_cadence/`), cho xem mẫu. | Hộp thư đã kết nối; người dùng duyệt kế hoạch và phạm vi gửi. |
| 10 | Chạy hằng ngày | Trợ lý | Trước tiên kiểm tra và cập nhật workflow, nếu có bản mới thì nạp lại hướng dẫn rồi mới làm tiếp (`workflows/UPDATING.md`, mục “Trước mỗi lần chạy hằng ngày”). Sau đó: phản hồi mới → tìm khách theo mục tiêu → email đến hạn. Cuối phiên tóm tắt và lưu tiến trình. Khi người dùng muốn chạy tự động: trợ lý tự tạo lịch theo `workflows/SCHEDULING.md` (hỏi giờ → cách duyệt email), không bắt người dùng vào trang Scheduled. | Có tóm tắt phiên, tiến trình được cập nhật; lịch (nếu có) đã tạo thật. |
| 11 | Báo cáo tuần | Trợ lý | Hỏi người nhận → ngày → giờ; cho xem bản nháp tổng hợp mọi chiến dịch, tách số theo chiến dịch (lưu `outputs/04_weekly_reports/`); đề xuất một điều chỉnh. Sau khi duyệt, tự đặt lịch gửi theo `SCHEDULING.md`. | Mẫu báo cáo được duyệt, lịch gửi đã tạo. |

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
| “Đọc AGENTS.md (hoặc CLAUDE.md) và tài liệu trong inputs…” | 4 |
| “Kiểm tra môi trường cho workflow này…” | 5 |
| “Kết nối CloakBrowser qua .mcp.json…” / “…qua .codex/config.toml…”, “Kết nối TinaCRM…” (người dùng đã có API key; làm theo mục “Thiết lập” trong `TINACRM_CONNECTION.md`: chạy `scripts/tinacrm_save_key.sh` (macOS) hoặc `scripts/tinacrm_save_key.ps1` (Windows) để bật hộp thoại cho người dùng dán khóa, không nhận khóa qua chat) | 6 |
| “Kết nối Gmail/Google Calendar/Apollo…”, “Kết nối thêm dịch vụ…” (`CONNECTORS.md`) | 6 |
| “Đề xuất tiêu chí khách hàng phù hợp (ICP)…”, “Tạo chiến dịch mới…” | 7 |
| “Tìm 10 khách theo ICP đã chốt…”, “Kiểm tra trùng và lưu danh sách đã duyệt vào TinaCRM…” | 8 |
| “Kết nối hộp thư…”, “Đề xuất chuỗi email chăm sóc…” | 9 |
| “Làm chiến dịch…”, “Tiếp tục chiến dịch…”, “Tiếp tục từ lần trước” | 10 (đúng chiến dịch đó) |
| “Đặt lịch chạy…”, “Tạm dừng lịch…”, “Đổi giờ chạy…”, “Xem các lịch…” | 10 (`SCHEDULING.md`) |
| “Thiết lập báo cáo hằng tuần…” | 11 |
| “Cập nhật workflow” | Ngoài chu trình: làm theo `workflows/UPDATING.md` |

Câu lệnh trên trang được viết ngắn cho người dùng. Vẫn áp dụng đầy đủ quy tắc an toàn: hỏi từng câu, giải thích ngắn trước khi cài, không ghi CRM khi câu lệnh chỉ yêu cầu đọc thử, không gửi email thật trước khi người dùng duyệt, không xin mật khẩu/khóa trong chat.

Nếu người dùng nhảy cóc, nói ngắn bước nào còn thiếu và hỏi: “1. Làm bước N trước. 2. Vẫn tiếp tục với thông tin hiện có.”

## Mở đầu phiên

Trước khi nói, kiểm tra `config/workflow_progress.md`, `inputs/`, `config/business.json`, `product-marketing.md`, `campaigns/`.

- **Câu đầu là “Làm/Tiếp tục chiến dịch <tên>”:** chọn chiến dịch đó cho cả phiên, đọc `campaigns/<slug>/progress.md` rồi làm tiếp (xem `CAMPAIGNS.md`).
- **Có tiến trình:** tóm tắt tối đa ba dòng, rồi hỏi “1. Tiếp tục bước N – <tên>. 2. Chạy hằng ngày (bước 10). 3. Việc khác.” Từ bước 7 trở đi, nếu có từ hai chiến dịch, hỏi chiến dịch trước.
- **Lần đầu, có tài liệu:** làm bước 4 ngay.
- **Lần đầu, `inputs` trống:** hỏi “1. Tôi tự đặt tài liệu vào thư mục (bước 2) — chỉ đường giúp tôi. 2. Tôi gửi website. 3. Hỏi tôi từng câu.” Nếu chọn 1, hướng dẫn mở Finder/File Explorer → thư mục workflow → `inputs` → thư mục tương ứng, sao chép và dán, rồi hỏi “Bạn dán xong chưa? 1. Rồi. 2. Chưa được.”

Nếu tài liệu nằm ngoài thư mục workflow, nhờ người dùng tự đặt vào `inputs`; không tự sao chép.

## Gọi tên theo màn hình người dùng thấy

Dùng tên nút như trên màn hình hiện tại. Claude Desktop: Code (biểu tượng `</>`), This computer, Choose… (nút chọn thư mục; bản cũ ghi No folder), Open folder…, Manual, Usage, Settings → MCP & APIs. ChatGPT desktop app: Codex, Local, chọn thư mục/dự án, Plugins, Scheduled, Settings → MCP servers, Ask for approval / Approve for me. Không nói “session”, “repository”, “MCP server”, “worktree” trừ khi người dùng hỏi. Trước khi ứng dụng hỏi quyền, nói: “Sắp tới ứng dụng sẽ hỏi quyền để [việc]. Bạn bấm cho phép nếu đúng như vậy.” Không đề nghị Bypass permissions (Claude) hay Full access (Codex). Nếu màn hình khác mô tả, hỏi người dùng đang thấy gì, không bịa tên nút.

## Lưu tiến trình

Ghi tiến trình (không commit, không chứa secret) sau mỗi bước và khi kết thúc phiên: bước 1–6 vào `config/workflow_progress.md`; bước 7–10 vào `campaigns/<slug>/progress.md` của chiến dịch đang làm (cùng định dạng, tiêu đề ghi tên chiến dịch). Không ghi tiến trình chiến dịch vào tệp chung để các phiên song song không đè nhau.

```markdown
# Tiến trình — <tên doanh nghiệp>
Cập nhật: <ngày giờ>
- [x] Bước 4 Trợ lý đọc tài liệu — <ghi chú>
- [ ] Bước 5 Kiểm tra môi trường — <trạng thái thật>
- [ ] Bước 6 Kết nối công cụ — CloakBrowser: …; TinaCRM: …
...
Đang chờ người dùng: <việc>
Bước tiếp theo: Bước N – <tên>
```

Chỉ đánh dấu xong khi đạt “Xong khi” bằng kết quả công cụ thật.
