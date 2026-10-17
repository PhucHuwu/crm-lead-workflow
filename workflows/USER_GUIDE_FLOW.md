# Luồng dẫn dắt khớp với trang hướng dẫn

Trang hướng dẫn (`web-docs/`) là những gì người dùng đã đọc trước khi gặp Claude. Claude dẫn dắt theo đúng thứ tự, tên gọi và thao tác trong các bài đó để người dùng không bị lạc. Tệp này ưu tiên hơn thứ tự “13 bước” trong tài liệu cũ khi nói chuyện với người dùng; 13 bước vẫn là checklist kỹ thuật nội bộ.

## Người dùng đã làm gì trước khi gặp Claude

1. **Tải workflow** (bài “Tải workflow”): tải ZIP, giải nén, mỗi doanh nghiệp một thư mục.
2. **Đặt tài liệu đúng chỗ** (bài “Đặt tài liệu đúng chỗ”): tự sao chép hồ sơ công ty vào `inputs/01_company_info/`, tài liệu sản phẩm/dịch vụ vào `inputs/02_marketing_materials/`.
3. **Mở tab Code trong Desktop** (bài “Mở tab Code trong Desktop”): Code → Local → No folder → Open folder… → chọn thư mục workflow; chế độ quyền Manual.

Vì vậy Claude **không** hỏi người dùng tải/gửi tài liệu lên chat ngay từ đầu, không nhắc Chat Projects, “Add to project” hay Project Knowledge. Nếu `inputs` trống, hướng dẫn người dùng tự mở Finder/File Explorer và sao chép tệp vào đúng thư mục như bài “Đặt tài liệu đúng chỗ”; không đề nghị Claude tự di chuyển/sao chép tệp của người dùng.

## Thứ tự giai đoạn (theo thứ tự bài hướng dẫn)

Mỗi giai đoạn: làm phần Claude làm được, hỏi từng câu một, chỉ chuyển sang giai đoạn sau khi đạt “Xong khi”. Có thể bỏ qua giai đoạn khi người dùng chọn “Để sau”, nhưng ghi rõ phần đó chưa sẵn sàng và không chạy bước phụ thuộc vào nó.

| # | Bài hướng dẫn (tên người dùng thấy) | Claude làm | Người dùng làm | Xong khi |
|---|---|---|---|---|
| 1 | Thiết lập lần đầu | Đọc `CLAUDE.md`, liệt kê tệp trong hai thư mục `inputs`, báo tệp đọc được/không đọc được. Tóm tắt lộ trình bằng tên bài, không đọc 13 bước. | Gửi câu bắt đầu, xác nhận đúng doanh nghiệp. | Đúng thư mục doanh nghiệp, biết tài liệu nào dùng được. |
| 2 | Thiết lập công cụ với Code | Kiểm tra Python/công cụ có sẵn, giải thích ngắn rồi xin quyền cài CloakBrowser theo `CLOAKBROWSER.md`, đăng ký MCP trong `.mcp.json`, chạy thử. | Duyệt lệnh khi ứng dụng hỏi (Manual), tự chạy trình cài đặt/nhập mật khẩu máy nếu cần. | CloakBrowser mở được trang thử bằng công cụ thật. |
| 3 | Kết nối TinaCRM | Hỏi địa chỉ TinaCRM, hướng dẫn Settings → MCP & APIs theo `TINACRM_CONNECTION.md`, đọc thử schema. Chưa ghi dữ liệu. | Đăng nhập/cấp quyền; nhờ người hỗ trợ tạo API key nếu cần. Không dán khóa vào chat. | Đã đọc thử đúng workspace và các trường lead. |
| 4 | Giới thiệu doanh nghiệp | Đọc `inputs`, hỏi phần thiếu (website, sản phẩm, khách thường mua, khu vực), viết `product-marketing.md`, tạo `config/business.json` từ mẫu. | Xác nhận tóm tắt, chọn sản phẩm ưu tiên. | Tóm tắt đúng, có sản phẩm ưu tiên, bằng chứng có nguồn. |
| 5 | Tìm khách phù hợp | Đề xuất khách phù hợp + thị trường (lưu `outputs/01_icp_criteria/`), hỏi nguồn tìm và mục tiêu/ngày, tìm danh sách nhỏ (lưu `outputs/02_crawled_leads/`), kiểm tra trùng rồi lưu TinaCRM khi được phép. | Duyệt tiêu chí, tự đăng nhập trong cửa sổ CloakBrowser, duyệt danh sách mẫu. | Danh sách nhỏ được duyệt; kết quả lưu CRM có số tạo mới/cập nhật/trùng/lỗi thật. |
| 6 | Gửi & theo dõi email | Hỏi loại hộp thư → địa chỉ gửi, hướng dẫn kết nối; đề xuất chuỗi email (lưu `outputs/03_email_cadence/`), cho xem mẫu. | Kết nối hộp thư trên màn hình đăng nhập, chọn “Gửi / Chỉnh / Chưa gửi”, chốt phạm vi tự động. | Có kế hoạch được duyệt; email thật chỉ gửi khi có cho phép. |
| 7 | Công việc hằng ngày | Theo thứ tự: phản hồi mới → tìm khách theo mục tiêu → email đến hạn. Kiểm tra khả năng chạy theo lịch trước khi hứa. Cuối phiên tóm tắt và lưu tiến trình. | Xem ba việc: khách cần trả lời, danh sách có đúng hướng, bước đang chờ. | Có tóm tắt phiên và tệp tiến trình được cập nhật. |
| 8 | Báo cáo hằng tuần | Hỏi người nhận → ngày → giờ/múi giờ; cho xem bản nháp (lưu `outputs/04_weekly_reports/`); đề xuất một điều chỉnh. | Duyệt mẫu báo cáo, quyết định có áp dụng đề xuất. | Có mẫu được duyệt; gửi định kỳ chỉ khi email + lịch đã kiểm tra. |

Ánh xạ sang 13 bước nội bộ: giai đoạn 4 = B1–B5, giai đoạn 5 = B6–B9, giai đoạn 6 = B10–B12, giai đoạn 8 = B13. Giai đoạn 2–3 là thiết lập công cụ, nên làm trước để khi tới giai đoạn 5 có thể lưu CRM ngay. Nếu người dùng muốn làm doanh nghiệp/khách hàng trước, đồng ý và quay lại công cụ khi cần.

## Mở đầu phiên đầu tiên

Trước khi nói, tự kiểm tra: `inputs/01_company_info/`, `inputs/02_marketing_materials/`, `config/business.json`, `config/workflow_progress.md`, `product-marketing.md`. Sau đó:

- **Đã có tiến trình:** tóm tắt ngắn việc đã xong và đề nghị tiếp tục giai đoạn đang dở (xem “Quay lại phiên sau”).
- **Có tài liệu trong inputs:** báo số tệp đã thấy ở từng thư mục, tệp nào chưa đọc được; rồi hỏi:
  > Tôi đã thấy tài liệu của bạn. Mình bắt đầu thế nào?
  > 1. Chuẩn bị công cụ trước (trình duyệt, TinaCRM) — theo thứ tự trang hướng dẫn.
  > 2. Tìm hiểu doanh nghiệp trước, công cụ làm sau.
  > 3. Tôi muốn thêm tài liệu trước.
- **inputs trống:** hỏi:
  > Tôi chưa thấy tài liệu trong thư mục inputs. Bạn muốn:
  > 1. Tự đặt tài liệu vào thư mục — tôi chỉ đường từng bước.
  > 2. Gửi website của doanh nghiệp.
  > 3. Trả lời từng câu hỏi về doanh nghiệp.

  Nếu chọn 1, hướng dẫn mở Finder/File Explorer → thư mục workflow → `inputs` → `01_company_info` hoặc `02_marketing_materials`, sao chép rồi dán; sau đó hỏi “Bạn đã dán xong chưa? 1. Rồi. 2. Chưa được.” và đọc lại thư mục.

Nếu tài liệu nằm ở thư mục khác đã được thêm bằng nút thư mục có dấu cộng (Add another folder), đọc trực tiếp ở đó; không tự sao chép vào `inputs`.

## Câu mẫu từ trang hướng dẫn

Người dùng thường dán nguyên câu mẫu từ trang. Nhận diện để biết đang ở giai đoạn nào và làm đúng phạm vi câu mẫu (ví dụ “Chưa gửi email”, “Chưa tạo, sửa hay xóa dữ liệu”, “Chưa cài gì trước khi giải thích”). Không làm vượt phạm vi đó dù các bước sau đã sẵn sàng.

| Câu mẫu bắt đầu bằng… | Giai đoạn |
|---|---|
| “Hãy đọc CLAUDE.md và hướng dẫn workflow…” / “Tôi muốn dùng workflow trong thư mục đang mở…” | 1 |
| “Hãy kiểm tra môi trường…”, “Hãy giúp tôi thiết lập CloakBrowser…”, “Hãy kiểm tra cách cấu hình MCP…” | 2 |
| “Tôi muốn kết nối TinaCRM…”, “Hãy kiểm tra kết nối TinaCRM…” | 3 |
| “Hãy tìm hiểu doanh nghiệp của tôi…”, “Hãy tóm tắt doanh nghiệp…”, “Hãy đọc tài liệu trong inputs…”, “Tôi vừa thêm thư mục…” | 4 |
| “Dựa trên tài liệu doanh nghiệp, hãy đề xuất nhóm khách…”, “Hãy tìm một danh sách nhỏ…”, “Hãy kiểm tra trùng với TinaCRM…” | 5 |
| “Hãy giúp tôi kết nối hộp thư…”, “Hãy đề xuất chuỗi email…” | 6 |
| “Tiếp tục chiến dịch hiện tại…”, “Tôi muốn thực hiện công việc theo lịch…”, “Tóm tắt những việc đã làm…” | 7 |
| “Hãy giúp tôi thiết lập báo cáo…”, “Hãy xem kết quả tuần này…” | 8 |
| “Tôi đang bị vướng…”, “Hãy tóm tắt vướng mắc…” | Trợ giúp: hỏi người dùng đang thấy gì, mỗi lần một câu |

Khi người dùng nhảy cóc (ví dụ dán câu giai đoạn 5 khi chưa có tóm tắt doanh nghiệp), nói ngắn phần còn thiếu và đề nghị: “1. Làm phần còn thiếu trước (khoảng vài câu hỏi). 2. Vẫn tiếp tục với thông tin hiện có.”

## Gọi tên theo trang hướng dẫn

- Dùng tên bài như trên khi chỉ người dùng xem lại: “Bạn có thể xem bài **Kết nối TinaCRM** trên trang hướng dẫn.”
- Dùng tên nút người dùng thấy trên màn hình: Code, Local, No folder, Open folder…, Add another folder, Manual, Settings → MCP & APIs. Không nói “session”, “repository”, “MCP server”, “worktree” trừ khi người dùng hỏi.
- Khi ứng dụng hiện yêu cầu cấp quyền, nói trước: “Sắp tới ứng dụng sẽ hỏi quyền để [việc]. Bạn bấm cho phép nếu đúng như vậy.” Không đề nghị chuyển sang Bypass permissions.
- Không mô tả nút/màn hình chưa chắc chắn; nếu khác với trang hướng dẫn, hỏi người dùng đang thấy gì.

## Lưu tiến trình

Ghi `config/workflow_progress.md` (riêng từng doanh nghiệp, không commit) sau mỗi giai đoạn hoặc khi kết thúc phiên, ngắn gọn:

```markdown
# Tiến trình — <tên doanh nghiệp>
Cập nhật: <ngày giờ>
- [x] 1 Thiết lập lần đầu — <ghi chú>
- [ ] 2 Công cụ — CloakBrowser: <trạng thái thật>
- [ ] 3 TinaCRM — <trạng thái thật>
...
Đang chờ người dùng: <việc>
Bước tiếp theo: <việc>
```

Chỉ đánh dấu xong khi đạt cột “Xong khi” bằng kết quả công cụ thật. Không lưu secret, mật khẩu, OTP hay token trong tệp này.

## Quay lại phiên sau

Người dùng mở lại session cũ hoặc tạo session mới với Local + đúng thư mục. Đọc `config/workflow_progress.md` trước, tóm tắt tối đa ba dòng, rồi hỏi:

> 1. Tiếp tục <bước tiếp theo>.
> 2. Làm công việc hằng ngày.
> 3. Việc khác.
