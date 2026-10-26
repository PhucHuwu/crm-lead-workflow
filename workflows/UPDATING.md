# Cập nhật workflow

Người dùng tải workflow bằng ZIP nên thư mục không có git. Cập nhật bằng script, không bắt người dùng tải lại ZIP hay chép lại tài liệu.

## Khi nào chạy

- Người dùng gửi “Cập nhật workflow” (hoặc ý tương tự).
- **Mỗi lần chạy hằng ngày (bước 10)**, theo lịch Scheduled hay người dùng gửi tay: luôn kiểm tra và cập nhật trước khi làm việc (mục “Trước mỗi lần chạy hằng ngày”).
- Phiên thiết lập (bước 1–9) **không** tự kiểm tra; chỉ chạy khi được yêu cầu, hoặc khi gặp lỗi mà tài liệu ghi là đã sửa ở bản mới.
- Cập nhật tay (người dùng yêu cầu) khi một phiên khác đang chạy chiến dịch: hỏi người dùng tạm dừng phiên đó trước.

## Trước mỗi lần chạy hằng ngày

Làm trước mọi việc khác của bước 10, không hỏi người dùng (lịch chạy không có ai trả lời):

1. Chạy lệnh cập nhật ở mục “Cách chạy” (không dùng `--check`).
2. Theo dòng cuối:
   - `up_to_date`: làm việc bình thường.
   - `busy`: phiên khác đang cập nhật. Đợi khoảng 1 phút rồi chạy lại, tối đa 3 lần; vẫn `busy` thì làm việc với bản hiện tại.
   - `error` (mất mạng, GitHub lỗi…): **không dừng công việc**. Làm việc với bản hiện tại và ghi một dòng vào phần tóm tắt cuối phiên: “Chưa cập nhật được workflow: <message>”.
   - `updated`: làm bước 3 trước khi làm việc.
3. **Nạp lại hướng dẫn mới** (phiên không tự khởi động lại, nên những gì đã đọc đầu phiên là bản cũ):
   - Đọc lại `CLAUDE.md`, `workflows/USER_GUIDE_FLOW.md` và `workflows/CAMPAIGNS.md`.
   - Đọc mọi tệp trong các dòng `changed:` (cũng lưu ở `.local/workflow-last-update.txt`) mà công việc hôm nay dùng tới: `workflows/`, `rules/`, `subagents/`, `skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`. Skill đã đổi phải đọc trực tiếp từ tệp; bản skill nạp đầu phiên đã cũ.
   - Tệp có đuôi `(removed)`: không dùng nữa, kể cả khi đã đọc trước đó.
   - Script (`scripts/*`) không cần đọc: lần gọi sau tự chạy bản mới.
   - Khi hướng dẫn mới khác điều đã đọc trước đó, **làm theo bản mới**.
   - Nếu `config/*.example.json` hoặc mẫu `campaign.json` có đổi: đối chiếu cấu hình hiện có. Trường mới có giá trị mặc định an toàn thì dùng mặc định; trường bắt buộc mà thiếu thì không đoán, ghi vào tóm tắt để người dùng bổ sung ở phiên sau, và bỏ qua phần việc cần trường đó.
4. Đầu phần tóm tắt cuối phiên ghi một dòng: “Đã cập nhật workflow lên bản <version> (<added> thêm, <updated> sửa, <removed> gỡ).”

Các chiến dịch chạy song song: script có khóa nên chỉ một phiên cập nhật tại một thời điểm. Phiên đang chạy dở khi phiên khác vừa cập nhật vẫn làm xong với hướng dẫn đã đọc; lần chạy sau sẽ dùng bản mới.

## Cách chạy

Chạy ở thư mục gốc workflow. Khi người dùng yêu cầu, giải thích ngắn trước: “Mình tải bản mới từ GitHub và chỉ thay tệp của workflow; tài liệu, chiến dịch, cấu hình và khóa của bạn giữ nguyên.” Lần chạy hằng ngày thì chạy luôn, không giải thích.

| Hệ điều hành | Lệnh |
|---|---|
| macOS | `sh scripts/update_workflow.sh` |
| Windows | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/update_workflow.ps1` |

Thư mục cũ chưa có script (tải trước khi có tính năng này):

- macOS: `curl -fsSL https://raw.githubusercontent.com/Tinasoft-Viet-Nam/TinaCRM-Agent/main/scripts/update_workflow.sh | sh -s -- "$PWD"`
- Windows (PowerShell): `$f="$env:TEMP\update_workflow.ps1"; iwr https://raw.githubusercontent.com/Tinasoft-Viet-Nam/TinaCRM-Agent/main/scripts/update_workflow.ps1 -OutFile $f; powershell -NoProfile -ExecutionPolicy Bypass -File $f (Get-Location).Path`

Thêm `--check` (macOS) hoặc `-Check` (Windows) để chỉ xem có bản mới không.

## Đọc kết quả (khi người dùng yêu cầu)

Trước dòng cuối có các dòng `changed: <tệp>`; dòng cuối luôn là `status=…`:

- `up_to_date`: báo “Workflow đã là bản mới nhất.”
- `update_available` (khi `--check`): hỏi “1. Cập nhật ngay. 2. Để sau.”
- `updated … added=… updated=… removed=… backup=…`: nạp lại hướng dẫn như bước 3 của mục trên, rồi báo số tệp thêm/cập nhật/gỡ. Nếu có `backup=`, nói các tệp cũ đã được giữ trong thư mục đó. Không cần mở phiên mới.
- `busy`: “Một phiên khác đang cập nhật, mình thử lại sau 1 phút.” rồi chạy lại.
- `error`: đọc nguyên văn `message`, báo ngắn; không thử cách khác ghi đè thủ công.

## Script giữ và thay gì

- **Không bao giờ ghi đè hay xóa:** `inputs/`, `outputs/`, `campaigns/`, `.local/`, `.venv*/`, `config/.browser_profile/`, `config/business.json`, `config/workflow_progress.md`, `config/tinacrm_api_key.txt`, `product-marketing.md`, `.mcp.json`, `.env*`, `CLAUDE.local.md`, `.claude/settings.local.json`. Tệp loại này chỉ được tạo khi chưa có (ví dụ `.gitkeep`).
- **Thay bằng bản mới:** mọi tệp workflow khác (`CLAUDE.md`, `workflows/`, `skills/`, `.claude/skills/`, `scripts/`, `rules/`, `subagents/`, `config/*.example.json`, template…). `web-docs/` (trang hướng dẫn) không được cài vào thư mục doanh nghiệp.
- **Sao lưu:** tệp workflow người dùng đã sửa được sao vào `.local/workflow-backups/<thời-gian>/` trước khi thay. Lần cập nhật đầu tiên chưa có `.workflow-manifest` nên mọi tệp khác bản mới đều được sao lưu.
- **Tệp bị gỡ ở bản mới:** chuyển vào thư mục sao lưu, không xóa.
- `.workflow-version` (commit đang cài) và `.workflow-manifest` (mã băm từng tệp) ở thư mục gốc; không sửa tay. `.local/workflow-last-update.txt`: danh sách tệp đổi ở lần cập nhật gần nhất. `.local/workflow-update.lock`: khóa trong lúc cập nhật (tự gỡ; khóa quá 15 phút được coi là bỏ dở).
- Thư mục là bản git (người phát triển): script từ chối, dùng `git pull`.

Nếu bản mới đổi cấu trúc `config/business.json` hay `campaign.json` (xem `config/*.example.json`), đối chiếu và bổ sung trường còn thiếu, hỏi người dùng giá trị cần thiết; không xóa giá trị đang có.
