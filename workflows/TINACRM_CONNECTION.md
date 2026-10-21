# Kết nối TinaCRM (REST API)

Workflow đọc/ghi TinaCRM **chỉ qua REST API** bằng `scripts/tinacrm_rest.py` với API key. Không dùng MCP của TinaCRM, không thêm TinaCRM vào `.mcp.json`, không dùng connector/Quick install của TinaCRM. (CloakBrowser vẫn dùng MCP cục bộ; không liên quan TinaCRM.)

## Thiết lập (bước 6)

1. Hỏi địa chỉ TinaCRM của doanh nghiệp, ví dụ `https://<workspace>.tinacrm.com`. Ghi vào `config/business.json`: `crm.base_url`, `crm.connection_method: "rest_api"`, `crm.auth_method: "api_key"`, `crm.credential_reference: "config/tinacrm_api_key.txt"`.
2. Người dùng tạo API key: Settings → MCP & APIs → tab API → Create API key; Name, Role đủ quyền đọc/ghi người, công ty, công việc; nên đặt ngày hết hạn.
3. Bật hộp thoại lưu khóa, chọn lệnh theo hệ điều hành:
   - macOS: `sh scripts/tinacrm_save_key.sh <base_url>`
   - Windows: `powershell -NoProfile -ExecutionPolicy Bypass -STA -File scripts/tinacrm_save_key.ps1 <base_url>` (chạy được từ Git Bash lẫn PowerShell)

   Nói trước với người dùng: "Một hộp thoại Kết nối TinaCRM sẽ hiện ra, dán khóa vào ô và bấm Lưu". Script lưu khóa vào `config/tinacrm_api_key.txt` (gitignore), không in khóa, và chỉ lưu khi REST của TinaCRM chấp nhận khóa (khóa cũ giữ nguyên nếu bị từ chối). Không nhận khóa qua chat, không bắt người dùng tự tìm hoặc mở tệp. Hộp thoại bị che thì nhắc tìm trên thanh Dock (macOS) hoặc thanh tác vụ (Windows). Kết quả "Đã hủy" thì hỏi lại; "từ chối" thì tạo khóa mới và chạy lại.
4. Chạy `python3 scripts/tinacrm_rest.py <base_url> check`, rồi đọc thử vài bản ghi bằng `get` (ví dụ `get companies`) để người dùng xác nhận đúng CRM của doanh nghiệp. Chưa ghi dữ liệu. Không cần mở phiên mới.

Thư mục đã thiết lập theo cách cũ (MCP): nếu `.mcp.json` có server `tinacrm`, xóa riêng mục đó (giữ `workflow-cloakbrowser`); trong `config/business.json` đổi `crm.connection_method` thành `"rest_api"`, bỏ `crm.mcp_url` nếu có (`base_url` là phần trước `/mcp`). Khóa đã lưu dùng tiếp được. Báo người dùng một câu, không cần mở phiên mới.

Bản Windows dùng Windows PowerShell 5.1 có sẵn (Windows Forms); tệp `.ps1` lưu UTF-8 có BOM để hiện đúng tiếng Việt, đừng lưu lại không BOM. Chưa chạy thử trên máy Windows thật.

## Đọc/ghi dữ liệu

Khóa đọc từ `config/tinacrm_api_key.txt`; script không in khóa và gọi bằng `curl` (Python trên một số máy lỗi chứng chỉ `*.tinacrm.com`).

```
python3 scripts/tinacrm_rest.py <base_url> check
python3 scripts/tinacrm_rest.py <base_url> upsert-company '{"name":"…","domain":"…","city":"…","country":"…"}'
python3 scripts/tinacrm_rest.py <base_url> upsert-person  '{"firstName":"…","lastName":"…","email":"…","phone":"…","jobTitle":"…","linkedin":"…","companyId":"<id>"}'
python3 scripts/tinacrm_rest.py <base_url> create-task    '{"title":"…","body":"…","dueAt":"<ISO>","assigneeId":"<id>","personId":"<id>","companyId":"<id>"}'
python3 scripts/tinacrm_rest.py <base_url> get <object-plural> '<filter>'
```

- `<base_url>` là `crm.base_url`.
- Thứ tự lưu một lead: company → person (gắn `companyId`) → task (gắn person và company qua `taskTargets`).
- Chống trùng: company theo domain rồi tên chính xác; person theo email chính. Kết quả `action` là `created` hoặc `existing`; dùng để báo số tạo mới/bỏ qua.
- Mỗi lệnh in một dòng JSON `{"ok": …}`. `ok: false` với HTTP 401/403: khóa sai hoặc hết hạn → người dùng tạo khóa mới, chạy lại script lưu khóa. Lỗi khác: báo người dùng, không đoán kết quả.
- `get` dùng bộ lọc REST của TinaCRM, ví dụ `'name[eq]:"ABC"'`, `'emails.primaryEmail[eq]:"a@b.com"'`.
- Trường hoặc object chưa có lệnh riêng: xem schema thật tại `<base_url>/rest/open-api/core` (cùng khóa) trước khi mở rộng script; không đoán tên trường.
- Trên Windows dùng `python` thay `python3` (cần Python; `curl.exe` có sẵn trên Windows 10+). Chưa thử trên Windows.
- Lỗi phân biệt rõ: khóa thiếu/sai/hết hạn, thiếu quyền Role, sai địa chỉ, sai trường dữ liệu. Không gộp thành “workspace chưa cấu hình”.

## Các cơ chế khác của TinaCRM

| Cơ chế | Đường dẫn trong source | Xác thực và workspace | Dùng để làm gì |
|---|---|---|---|
| Data API | `/rest/<object-plural>`; batch `/rest/batch/<object-plural>` | `Authorization: Bearer <API-key-token>`; workspace lấy từ token; quyền phụ thuộc Role | Đọc/tạo/cập nhật dữ liệu theo schema thực tế |
| Workflow trigger inbound | `/webhooks/workflows/:workspaceId/:workflowId` (GET/POST) | `PublicEndpointGuard` + `NoPermissionGuard`; không kiểm tra Bearer trong controller này | Chạy workflow WEBHOOK đang ACTIVE, payload POST vào workflow |
| Quản lý outbound webhook | `/rest/webhooks`, `/rest/metadata/webhooks` | JWT + workspace + quyền `API_KEYS_AND_WEBHOOKS` | Đăng ký CRM gửi sự kiện ra target URL, không nhập lead |

## Outbound webhook secret không phải API token

Job gửi thông báo POST đến target URL. Nếu có secret, nó gửi:

- `X-Twenty-Webhook-Timestamp`
- `X-Twenty-Webhook-Signature`
- `X-Twenty-Webhook-Nonce`

Chữ ký: HMAC-SHA256(secret, `timestamp + ':' + JSON.stringify(payloadWithoutSecret)`), hex. Receiver phải xác minh payload/chữ ký và cơ chế timestamp/nonce thích hợp; Bearer API key không thay thế chữ ký này.

## Nếu dùng workflow webhook để nhập lead

- Lấy toàn bộ URL từ workflow đang được publish/activate; không yêu cầu người dùng tự ghép workspace/workflow ID.
- Workflow phải thực sự có các bước tạo/cập nhật bản ghi và ánh xạ trường. Payload `{action: ...}` cũ chỉ là ví dụ, không phải giao thức TinaCRM mặc định.
- Source controller workflow hiện public. Gửi thêm token không tự khiến endpoint đó xác thực token. Nếu deployment có gateway/custom auth, khai báo riêng auth mode/header theo cấu hình đó.
- Kết quả `success: true, workflowRunId` xác nhận khởi chạy, không xác nhận lead đã lưu. Theo dõi workflow run và đọc lại bản ghi.
- `/webhooks/server/:resolverLogicFunctionUniversalIdentifier` là route khác cho logic function; cần kiểm tra logic handler cụ thể, không áp dụng mặc định như workflow trigger.
