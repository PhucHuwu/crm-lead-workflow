# Kết nối dịch vụ khác (connector)

Làm ở bước 6, sau CloakBrowser và TinaCRM. Mục đích: kết nối sẵn những dịch vụ các bước sau sẽ cần, để lúc tìm khách, gửi email hay chạy theo lịch không phải dừng lại chờ người dùng đăng nhập.

Cách kết nối duy nhất cho người dùng: **Claude hiện thẻ Connect trong chat, người dùng bấm Connect và đăng nhập nếu được hỏi.** Không hướng dẫn người dùng vào Settings, không bắt họ sao chép địa chỉ hay thêm custom connector. Claude không nhận mật khẩu, mã OTP hay token qua chat. Connector đã kết nối dùng được trong mọi phiên Code của tài khoản Claude đó, mọi thư mục doanh nghiệp.

## Đề xuất

Chỉ đề xuất những gì doanh nghiệp này sẽ dùng, dựa trên `product-marketing.md`, `config/business.json` và câu trả lời trước đó. Không đề xuất cả danh sách.

| Dịch vụ | Dùng ở | Đề xuất khi |
|---|---|---|
| Gmail | Bước 9–10: gửi email, đọc phản hồi | Hộp thư liên hệ khách là Gmail/Google Workspace |
| Microsoft 365 (Outlook, lịch) | Bước 9–10 | Hộp thư là Outlook/Microsoft 365 |
| Google Calendar | Bước 10: đặt lịch hẹn khi khách đồng ý gặp, tìm giờ trống | Doanh nghiệp hẹn gặp/demo với khách và dùng Google |
| Apollo.io | Bước 8: tìm công ty, người quyết định, bổ sung email | Khách là doanh nghiệp (B2B) và người dùng **đã có** tài khoản Apollo |
| Google Drive | Bước 4: đọc tài liệu doanh nghiệp | Tài liệu nằm trên Drive thay vì thư mục `inputs/` |
| Apify | Bước 8: lấy danh sách doanh nghiệp từ Google Maps, dữ liệu công ty Việt Nam | Khách là cửa hàng, cơ sở địa phương (Maps) hoặc cần danh sách lớn. Cần tài khoản Apify, chạy tốn credit |
| ThongtinCty | Bước 8: tra mã số thuế, địa chỉ, người đại diện, ngành nghề của doanh nghiệp Việt Nam | Khách là doanh nghiệp tại Việt Nam. Miễn phí, không cần tài khoản, **không cần người dùng kết nối** (mục dưới) |

Chỉ đề xuất dịch vụ có trong danh bạ connector của Claude (hiện được thẻ Connect), riêng ThongtinCty Claude tự thêm. Dịch vụ người dùng nhắc tới mà không hiện được thẻ (ví dụ Hunter): nói rõ là chưa hỗ trợ kết nối đơn giản, đề xuất dịch vụ thay thế có trong danh bạ.

Không đề xuất: CRM khác (HubSpot, Salesforce, Pipedrive…) vì trùng TinaCRM; Zapier/Make/n8n; công cụ nhắn tin LinkedIn tự động.

Hỏi một lượt, cho chọn nhiều: “Bạn muốn kết nối sẵn dịch vụ nào? 1. Gmail (gửi email cho khách). 2. Google Calendar (đặt lịch hẹn). 3. Apollo (tìm khách). 4. Để sau.” Mỗi lựa chọn một dòng lý do ngắn. Không đưa ThongtinCty vào câu hỏi.

Lưu ý khi đề xuất Apollo, nói trước khi người dùng kết nối:
- Cần tài khoản Apollo đăng nhập bằng email công ty (không nhận Gmail/Yahoo cá nhân).
- Apollo yêu cầu tắt tùy chọn cho Anthropic dùng dữ liệu để huấn luyện (Claude: Settings → Privacy) trước khi kết nối.
- Một số thao tác (bổ sung email/số điện thoại) trừ credit của gói Apollo; tìm kiếm thì không lộ email.

## Hướng dẫn kết nối

1. Dùng công cụ gợi ý connector (suggest connectors) của phiên để hiện thẻ “Suggested connectors” cho **tất cả** dịch vụ người dùng đã chọn, trong một lần.
2. Nói một câu: “Bấm Connect trên từng dịch vụ ở thẻ trên, đăng nhập nếu được hỏi rồi bấm cho phép. Xong báo mình.” Gmail/Calendar: thêm “chọn đúng tài khoản Google dùng để liên hệ khách”.
3. Người dùng báo xong: kiểm tra (mục dưới). Không thấy công cụ của dịch vụ trong phiên này thì nhờ mở phiên mới (+ New) cùng thư mục, rồi kiểm tra lại.

Sự cố:
- Không hiện được thẻ (phiên không có công cụ gợi ý connector): hướng dẫn một câu “Bấm dấu + cạnh ô nhập → Connectors → Browse connectors → tìm <tên dịch vụ> → Connect.”
- Gói Team/Enterprise: thẻ hiện nút Request thay vì Connect thì người dùng bấm Request, chờ quản trị tài khoản Claude bật. Google Workspace báo “admin needs to review”: quản trị Google Workspace phải cho phép ứng dụng Claude.

### ThongtinCty (Claude tự thêm)

Khách là doanh nghiệp Việt Nam thì Claude tự thêm vào `.mcp.json` của thư mục workflow (giữ nguyên các server đã có), không hỏi người dùng thêm bước nào:

```json
"thongtincty": { "type": "http", "url": "https://thongtincty.com/mcp" }
```

Phiên mới sẽ hỏi cho phép dùng server trong `.mcp.json`: nói trước “Phiên sau nếu Claude hỏi cho dùng thongtincty, bấm cho phép.” Không cần đăng nhập.

## Kiểm tra

Chỉ thao tác đọc, không gửi, không tạo:

- Gmail: tìm 1 email gần nhất, chỉ báo tiêu đề và người gửi.
- Google Calendar / Microsoft 365: liệt kê tên các lịch.
- Apollo: tìm 1–2 công ty theo ICP (tìm kiếm, không bổ sung email để khỏi tốn credit).
- Google Drive: tìm 1 tệp theo tên doanh nghiệp.
- ThongtinCty: tra chính doanh nghiệp người dùng (theo tên hoặc mã số thuế).
- Apify: chỉ liệt kê công cụ có sẵn, chưa chạy actor nào (chạy tốn credit).

Lưu vào `config/business.json` → `connectors`: tên dịch vụ, `status` (`connected` / `skipped` / `failed`), tài khoản hiển thị (email, không lưu gì khác), ngày kiểm tra. Hộp thư đã kết nối thì điền luôn `email.provider` và `email.sender_address`.

## Dùng ở các bước sau

- Bước 8: Apollo, Apify, ThongtinCty đã kết nối thì đưa vào danh sách nguồn đề xuất (skill prospecting), nhưng vẫn chọn theo ICP, không mặc định. ThongtinCty dùng để bổ sung/xác minh thông tin doanh nghiệp Việt Nam trước khi lưu. Apify: báo trước số credit ước tính, chờ người dùng đồng ý mới chạy. Dữ liệu từ các nguồn này vẫn lưu vào TinaCRM qua `scripts/tinacrm_rest.py`, chống trùng như nguồn khác.
- Bước 9–10: gửi và đọc email qua connector Gmail/Microsoft 365 nếu đã kết nối; đặt lịch hẹn qua Calendar khi khách đồng ý gặp.
- Mặc định Claude Desktop hỏi người dùng trước khi gửi email hoặc tạo lịch. Lần chạy theo lịch không có ai bấm duyệt nên sẽ dừng ở đó: trước khi đặt lịch chạy (bước 10, `SCHEDULING.md`), hỏi người dùng muốn duyệt từng email hay cho phép gửi tự động trong giới hạn `daily_send_limit`. Không tự đổi quyền.
- Đầu mỗi lần chạy, connector cần dùng mà không có trong phiên (bị ngắt, hết hạn đăng nhập): bỏ phần việc đó, làm phần còn lại, ghi vào tóm tắt “Cần kết nối lại <dịch vụ>”.
