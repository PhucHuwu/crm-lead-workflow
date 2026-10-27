# Đặt lịch chạy tự động

Trợ lý tự tạo lịch chạy trên máy ngay trong phiên. Người dùng không cần mở trang Scheduled hay điền form: chỉ trả lời giờ chạy và cách duyệt email. Cách tạo khác nhau giữa Claude Code và Codex (`config/business.json` → `assistant`); phần hỏi, câu lệnh và cách chạy theo lịch dùng chung.

Dùng ở bước 10 (lịch chạy hằng ngày cho từng chiến dịch) và bước 11 (lịch báo cáo tuần). Câu mẫu: “Đặt lịch chạy chiến dịch…”, “Thiết lập báo cáo hằng tuần…”.

## Điều kiện trước khi đặt lịch

- Chiến dịch đã qua bước 7–9: có ICP, nguồn tìm khách, chuỗi email đã duyệt và ít nhất một lần chạy tay thành công (bước 10 gửi tay). Chưa đủ thì nói bước còn thiếu, không đặt lịch.
- Phiên có công cụ quản lý lịch (tạo, liệt kê, sửa). Không có thì xem mục “Không có công cụ đặt lịch”.
- Codex: lần chạy tay ở bước 10 không còn câu hỏi quyền nào (xem mục “Codex”).

## Hỏi người dùng (từng câu, đánh số)

1. **Giờ chạy:** đề xuất giờ hành chính theo múi giờ máy, lệch ít nhất 30 phút so với lịch của chiến dịch khác (liệt kê lịch hiện có trước). Ví dụ: “1. 8:30 sáng các ngày trong tuần (nên chọn). 2. 8:30 sáng mỗi ngày. 3. Giờ khác.”
2. **Duyệt email** (theo `CONNECTORS.md`): “1. Lần chạy theo lịch chỉ soạn nháp, tôi duyệt rồi mới gửi (nên chọn). 2. Tự gửi email đến hạn, tối đa `daily_send_limit` email/ngày.” Không tự chọn thay.

## Tạo lịch

- Liệt kê lịch hiện có trước. Đã có lịch cho chiến dịch này thì sửa lịch đó, không tạo trùng.
- Tên: `crm-<slug doanh nghiệp>-<slug chiến dịch>`; báo cáo tuần: `crm-<slug doanh nghiệp>-bao-cao-tuan`.
- Chạy trên máy này (local), thư mục: đúng thư mục workflow đang mở. Không bật worktree (`CAMPAIGNS.md`).
- Câu lệnh của lịch (giữ ngắn, quy tắc nằm trong workflow nên cập nhật workflow không cần sửa lịch):

  ```text
  Tiếp tục chiến dịch <tên chiến dịch>. Đây là lần chạy theo lịch: không có ai trả lời câu hỏi.
  Làm theo bước 10 trong workflows/USER_GUIDE_FLOW.md và workflows/SCHEDULING.md (mục “Khi chạy theo lịch”).
  ```

  Báo cáo tuần: “Lập báo cáo tuần theo bước 11 … (mục “Khi chạy theo lịch”)”.
- Lưu vào `campaigns/<slug>/campaign.json` → `schedule`: `daily_run_time`, `days`, `task_name`, `email_approval` (`draft_only` / `auto_send`). Báo cáo tuần lưu vào `config/business.json` → `reporting.task_name`. Ghi `schedule.execution_method` (`"claude_desktop_scheduled_task"` hoặc `"codex_scheduled_task"`), `schedule.timezone` trong `config/business.json`.
- Báo kết quả thật từ công cụ (tên lịch, giờ chạy kế tiếp). Không nói “đã đặt lịch” khi công cụ chưa trả về thành công.

## Claude Code

- Tạo scheduled task cục bộ của Claude Desktop bằng công cụ quản lý lịch trong phiên. `execution_method = "claude_desktop_scheduled_task"`.
- Nhắc người dùng (ngắn):
  - Lịch chỉ chạy khi máy bật, không ngủ và Claude Desktop đang mở. Máy ngủ qua giờ chạy thì Desktop chạy bù một lần khi mở lại.
  - Mỗi lần chạy hiện thành một phiên mới trong mục Scheduled ở thanh bên trái. Lần đầu có thể hỏi quyền: bấm **Always allow** cho việc đúng như mô tả, các lần sau không hỏi lại.
  - Muốn đổi giờ, tạm dừng hay xem lịch: chỉ cần nhắn trợ lý (“Tạm dừng lịch chiến dịch X”, “Đổi giờ chạy…”). Xóa hẳn lịch thì người dùng bấm Delete trong trang của lịch.

## Codex (ChatGPT desktop app)

- Tạo bằng chính cuộc trò chuyện Codex đang mở thư mục workflow: lịch **độc lập** (standalone, mỗi lần chạy là một cuộc trò chuyện mới), chạy **trong thư mục dự án (local)**, không dùng worktree. `execution_method = "codex_scheduled_task"`.
- Thêm `$cold-email` vào cuối câu lệnh chạy chiến dịch, `$weekly-reporting` vào câu lệnh báo cáo tuần, để lần chạy chắc chắn nạp đúng skill.
- Lịch chạy không người trông, dùng quyền mặc định của Codex (sandbox chặn mạng). Cập nhật workflow và ghi TinaCRM chỉ chạy được khi:
  1. Thư mục workflow đã được **tin cậy** (Codex nạp `.codex/rules/workflow.rules` và `.codex/config.toml`), hoặc
  2. Người dùng đã duyệt **luôn** cho các lệnh đó trong một lần chạy tay (Codex lưu vào `~/.codex/rules/default.rules`).

  Trước khi tạo lịch, chạy tay “Tiếp tục chiến dịch <tên>” một lần trên Codex và xác nhận không còn câu hỏi quyền nào. Không đề xuất **Full access** cho lịch.
- Gửi email qua plugin: lần chạy theo lịch có thể dừng ở bước cần duyệt; khi đó làm theo `email_approval = draft_only` và ghi vào tóm tắt.
- Nhắc người dùng (ngắn): lịch chỉ chạy khi máy bật, không ngủ và ChatGPT desktop app đang mở. Kết quả mỗi lần chạy xem ở mục **Scheduled** ở thanh bên. Đổi giờ, tạm dừng: nhắn trợ lý hoặc sửa trong mục Scheduled.

## Chỉ một công cụ đặt lịch

Chỉ đặt lịch ở **một** công cụ: đã có lịch ở Claude Desktop thì không tạo thêm ở ChatGPT desktop app, và ngược lại, để không chạy trùng chiến dịch (gửi email hai lần). Đổi công cụ thì xóa lịch cũ trước, rồi tạo lại ở công cụ mới.

## Khi chạy theo lịch

- Không hỏi người dùng (không ai trả lời). Việc cần người dùng (đăng nhập lại, duyệt nháp, lỗi quyền) thì bỏ qua phần đó, làm phần còn lại, ghi vào tóm tắt cuối phiên.
- Theo thứ tự: cập nhật workflow (`UPDATING.md`) → phản hồi mới → tìm khách theo mục tiêu ngày → email đến hạn → tóm tắt, lưu `campaigns/<slug>/progress.md`.
- Chạy bù/chạy muộn: nếu đã quá 17:00 giờ địa phương thì vẫn xử lý phản hồi và lưu CRM, nhưng không gửi email mới; ghi “dời gửi sang lần chạy sau”. Đã có lần chạy hoàn tất hôm nay (theo `progress.md`) thì chỉ kiểm tra phản hồi, không tìm khách hay gửi lặp.
- `email_approval = draft_only`: soạn nháp trong hộp thư (hoặc lưu vào `campaigns/<slug>/outputs/03_email_cadence/`), không gửi. `auto_send`: gửi trong giới hạn `daily_send_limit`, tôn trọng mọi quy tắc ngừng liên hệ.
- Khóa TinaCRM lỗi hoặc connector mất kết nối: không thử cách khác để vượt quyền, ghi “Cần kết nối lại <dịch vụ>”.

## Không có công cụ đặt lịch

Phiên bản ứng dụng cũ hoặc gói không hỗ trợ: nói ngắn “Máy này chưa cho trợ lý tự đặt lịch.” rồi hỏi “1. Mỗi ngày tôi tự gửi câu lệnh chạy hằng ngày. 2. Hướng dẫn tôi tạo lịch bằng tay. 3. Tôi cập nhật ứng dụng rồi thử lại.” Chọn 2 thì đưa từng thao tác:

- Claude Desktop: Scheduled → New task → điền câu lệnh ở trên, chọn thư mục workflow và giờ chạy.
- ChatGPT desktop app: mục **Scheduled** ở thanh bên → tạo lịch mới → chọn dự án là thư mục workflow, chạy local (không worktree) → dán câu lệnh ở trên → chọn giờ.
