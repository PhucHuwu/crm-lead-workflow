# Chiến dịch và chạy song song

Một thư mục workflow = một doanh nghiệp. Trong đó có thể có nhiều **chiến dịch**: mỗi chiến dịch là một nhóm khách hoặc một sản phẩm/kịch bản email riêng. Người dùng chạy song song bằng cách mở nhiều phiên (+ New) trong Claude Desktop, mỗi phiên làm một chiến dịch hoặc một doanh nghiệp.

## Cấu trúc

```
<thư mục doanh nghiệp>/
  inputs/                      dùng chung: tài liệu doanh nghiệp
  product-marketing.md         dùng chung
  config/business.json         dùng chung: doanh nghiệp, TinaCRM, hộp thư, báo cáo
  config/workflow_progress.md  tiến trình bước 1–6 (thiết lập chung)
  outputs/04_weekly_reports/   báo cáo tuần tổng hợp mọi chiến dịch
  campaigns/<slug>/
    campaign.json              mẫu: config/campaign.example.json
    progress.md                tiến trình bước 7–10 của chiến dịch
    outputs/01_icp_criteria/
    outputs/02_crawled_leads/
    outputs/03_email_cadence/
```

`slug` viết thường, không dấu, nối bằng gạch ngang, ví dụ `ban-le-hcm`, `logistics-erp`. Người dùng chỉ cần nói tên chiến dịch bằng lời; Claude tự đặt slug và báo lại.

Khi tài liệu khác nói `outputs/01_icp_criteria`, `outputs/02_crawled_leads`, `outputs/03_email_cadence`, hiểu là thư mục đó **trong chiến dịch đang làm**: `campaigns/<slug>/outputs/...`.

## Mỗi phiên làm một chiến dịch

- Mở đầu phiên: đọc `config/workflow_progress.md` và liệt kê `campaigns/` (thư mục là danh sách chiến dịch chính thức). Nếu người dùng chưa nói chiến dịch nào, hỏi: “1. <chiến dịch A>. 2. <chiến dịch B>. 3. Tạo chiến dịch mới.” Có đúng một chiến dịch thì dùng luôn và nói tên.
- Câu “Làm chiến dịch <tên>” hoặc “Tiếp tục chiến dịch <tên>” chọn chiến dịch cho cả phiên. Nói tên chiến dịch khi báo kết quả để người dùng không nhầm phiên.
- Chỉ ghi vào `campaigns/<slug>/` của chiến dịch đang làm. Các tệp dùng chung (`inputs/`, `product-marketing.md`, `config/business.json`, `.mcp.json`, khóa) chỉ đọc; muốn sửa thì hỏi người dùng trước và nhắc rằng các phiên khác cũng dùng chúng.
- Không đọc hoặc sửa thư mục chiến dịch khác, trừ khi kiểm tra trùng khách (dưới đây) hoặc tổng hợp báo cáo tuần.

## Tạo chiến dịch (bước 7)

1. Hỏi tên chiến dịch, nhóm khách hoặc sản phẩm của chiến dịch.
2. Tạo `campaigns/<slug>/` với `campaign.json` từ `config/campaign.example.json`, `progress.md` và ba thư mục `outputs`.
3. Làm ICP cho riêng chiến dịch, lưu vào `campaigns/<slug>/outputs/01_icp_criteria/`.

## Không để hai chiến dịch chạm cùng một khách

- Trước khi lưu khách vào TinaCRM: tìm theo email, domain website và URL hồ sơ trong TinaCRM và trong `campaigns/*/outputs/02_crawled_leads/`. Khách đã thuộc chiến dịch khác thì không tạo mới, không đưa vào chuỗi email của chiến dịch này; báo “đã thuộc chiến dịch X”.
- Mỗi khách chỉ nằm trong một chuỗi email đang chạy.
- Ghi chiến dịch lên bản ghi TinaCRM: dùng trường chiến dịch nếu workspace có (ánh xạ trong `config/business.json` → `crm.field_mapping.campaign`); nếu chưa có, hỏi người dùng có muốn tạo trường không, hoặc ghi vào ghi chú của bản ghi.

## Tài nguyên dùng chung

- **Hộp thư:** mọi chiến dịch gửi qua cùng hộp thư. `email.daily_send_limit` trong `config/business.json` là tổng cho cả hộp thư; `email.daily_send_limit` của mỗi chiến dịch là phần được chia, tổng không vượt mức chung.
- **Trình duyệt (CloakBrowser):** mỗi chiến dịch dùng hồ sơ trình duyệt riêng bằng tham số `profile=<slug>` của `browser_open`; người dùng đăng nhập riêng trong từng hồ sơ. Không đăng nhập cùng một tài khoản mạng xã hội ở hai chiến dịch chạy cùng lúc: nguy cơ bị khóa. Nếu chỉ có một tài khoản, lần lượt tìm khách từng chiến dịch.
- **TinaCRM:** dùng chung kết nối và khóa.

## Chạy theo lịch

- Mỗi chiến dịch một tác vụ trong **Scheduled**, câu lệnh “Tiếp tục chiến dịch <tên>”, cùng thư mục doanh nghiệp, tắt tùy chọn worktree.
- Đặt giờ lệch nhau (ít nhất 30 phút). Claude Desktop có thể bỏ qua một lần chạy khi lần trước chưa xong hoặc đang có tác vụ hẹn giờ khác chạy.
- Máy phải bật và Claude Desktop phải mở.

## Nhiều doanh nghiệp

Mỗi doanh nghiệp một thư mục workflow riêng (bước 1). Mở mỗi doanh nghiệp trong một phiên riêng: + New → Choose… → thư mục doanh nghiệp đó. Không dùng dữ liệu, khóa hoặc hồ sơ trình duyệt của doanh nghiệp khác.

## Không dùng worktree

Không đề nghị tùy chọn worktree cho workflow này: bản sao worktree không có `inputs`, cấu hình, khóa (không nằm trong git) và kết quả nằm ngoài thư mục người dùng biết.
