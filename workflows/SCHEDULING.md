# Đặt lịch chạy tự động

Claude tự tạo lịch (scheduled task cục bộ của Claude Desktop) ngay trong phiên. Người dùng không cần mở trang Scheduled hay điền form: chỉ trả lời giờ chạy và cách duyệt email.

Dùng ở bước 10 (lịch chạy hằng ngày cho từng chiến dịch) và bước 11 (lịch báo cáo tuần). Câu mẫu: “Đặt lịch chạy chiến dịch…”, “Thiết lập báo cáo hằng tuần…”.

## Điều kiện trước khi đặt lịch

- Chiến dịch đã qua bước 7–9: có ICP, nguồn tìm khách, chuỗi email đã duyệt và ít nhất một lần chạy tay thành công (bước 10 gửi tay). Chưa đủ thì nói bước còn thiếu, không đặt lịch.
- Phiên có công cụ quản lý scheduled task của Claude Desktop (tạo, liệt kê, sửa). Không có thì xem mục “Không có công cụ đặt lịch”.

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
- Lưu vào `campaigns/<slug>/campaign.json` → `schedule`: `daily_run_time`, `days`, `task_name`, `email_approval` (`draft_only` / `auto_send`). Báo cáo tuần lưu vào `config/business.json` → `reporting.task_name`. Ghi `schedule.execution_method = "claude_desktop_scheduled_task"`, `schedule.timezone` trong `config/business.json`.
- Báo kết quả thật từ công cụ (tên lịch, giờ chạy kế tiếp). Không nói “đã đặt lịch” khi công cụ chưa trả về thành công.

## Sau khi tạo: nhắc người dùng (ngắn)

- Lịch chỉ chạy khi máy bật, không ngủ và Claude Desktop đang mở. Máy ngủ qua giờ chạy thì Desktop chạy bù một lần khi mở lại.
- Mỗi lần chạy hiện thành một phiên mới trong mục Scheduled ở thanh bên trái. Lần đầu có thể hỏi quyền: bấm **Always allow** cho việc đúng như mô tả, các lần sau không hỏi lại.
- Muốn đổi giờ, tạm dừng hay xem lịch: chỉ cần nhắn Claude (“Tạm dừng lịch chiến dịch X”, “Đổi giờ chạy…”). Xóa hẳn lịch thì người dùng bấm Delete trong trang của lịch.

## Khi chạy theo lịch

- Không hỏi người dùng (không ai trả lời). Việc cần người dùng (đăng nhập lại, duyệt nháp, lỗi quyền) thì bỏ qua phần đó, làm phần còn lại, ghi vào tóm tắt cuối phiên.
- Theo thứ tự: cập nhật workflow (`UPDATING.md`) → phản hồi mới → tìm khách theo mục tiêu ngày → email đến hạn → tóm tắt, lưu `campaigns/<slug>/progress.md`.
- Chạy bù/chạy muộn: nếu đã quá 17:00 giờ địa phương thì vẫn xử lý phản hồi và lưu CRM, nhưng không gửi email mới; ghi “dời gửi sang lần chạy sau”. Đã có lần chạy hoàn tất hôm nay (theo `progress.md`) thì chỉ kiểm tra phản hồi, không tìm khách hay gửi lặp.
- `email_approval = draft_only`: soạn nháp trong hộp thư (hoặc lưu vào `campaigns/<slug>/outputs/03_email_cadence/`), không gửi. `auto_send`: gửi trong giới hạn `daily_send_limit`, tôn trọng mọi quy tắc ngừng liên hệ.
- Khóa TinaCRM lỗi hoặc connector mất kết nối: không thử cách khác để vượt quyền, ghi “Cần kết nối lại <dịch vụ>”.

## Không có công cụ đặt lịch

Phiên bản Claude Desktop cũ hoặc gói không hỗ trợ: nói ngắn “Máy này chưa cho Claude tự đặt lịch.” rồi hỏi “1. Mỗi ngày tôi tự gửi câu lệnh chạy hằng ngày. 2. Tôi cập nhật Claude Desktop rồi thử lại.” Chỉ khi người dùng muốn tự tạo, đưa một dòng: Scheduled → New task → điền câu lệnh ở trên, chọn thư mục workflow và giờ chạy.
