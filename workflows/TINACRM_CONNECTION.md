# Kết nối TinaCRM (REST API)

Workflow đọc/ghi TinaCRM **chỉ qua REST API** bằng `scripts/tinacrm_rest.py` với API key. Không dùng MCP của TinaCRM, không thêm TinaCRM vào `.mcp.json`, không dùng connector/Quick install của TinaCRM.

## Thiết lập (bước 6)

1. Địa chỉ TinaCRM mặc định là `https://app.tinacrm.com`: người dùng mở link này, đăng nhập và vào workspace của doanh nghiệp; API key tự xác định workspace nên không cần hỏi địa chỉ riêng. Chỉ hỏi khi doanh nghiệp dùng địa chỉ khác (ví dụ `https://<workspace>.tinacrm.com`). Ghi vào `config/business.json`: `crm.base_url`, `crm.connection_method: "rest_api"`, `crm.auth_method: "api_key"`, `crm.credential_reference: "config/tinacrm_api_key.txt"`.
2. Người dùng tạo API key: Settings → MCP & APIs → tab API → Create API key; Name, Role đủ quyền đọc/ghi người, công ty, công việc (muốn dùng workflow phụ đăng bài website thì Role cần được sửa Data model, thường là Admin, để trợ lý tạo mục “Bài viết”); nên đặt ngày hết hạn.
3. Bật hộp thoại lưu khóa, chọn lệnh theo hệ điều hành:
   - macOS: `sh scripts/tinacrm_save_key.sh <base_url>`
   - Windows: `powershell -NoProfile -ExecutionPolicy Bypass -STA -File scripts/tinacrm_save_key.ps1 <base_url>` (chạy được từ Git Bash lẫn PowerShell)

   Nói trước với người dùng: "Một hộp thoại Kết nối TinaCRM sẽ hiện ra, dán khóa vào ô và bấm Lưu". Script lưu khóa vào `config/tinacrm_api_key.txt` (gitignore), không in khóa, và chỉ lưu khi REST của TinaCRM chấp nhận khóa (khóa cũ giữ nguyên nếu bị từ chối). Không nhận khóa qua chat, không bắt người dùng tự tìm hoặc mở tệp. Hộp thoại bị che thì nhắc tìm trên thanh Dock (macOS) hoặc thanh tác vụ (Windows). Kết quả "Đã hủy" thì hỏi lại; "từ chối" thì tạo khóa mới và chạy lại.
4. Chạy `python3 scripts/tinacrm_rest.py <base_url> check`, rồi đọc thử vài bản ghi bằng `get` (ví dụ `get companies`) để người dùng xác nhận đúng CRM của doanh nghiệp. Chưa ghi dữ liệu. Không cần mở phiên mới.

Thư mục đã thiết lập theo cách cũ (MCP): nếu `.mcp.json` có server `tinacrm`, xóa mục đó (cùng `workflow-cloakbrowser`, `thongtincty` nếu có; CloakBrowser đã bỏ, ThongtinCty nay là lệnh script); trong `config/business.json` đổi `crm.connection_method` thành `"rest_api"`, bỏ `crm.mcp_url` nếu có (`base_url` là phần trước `/mcp`). Khóa đã lưu dùng tiếp được. Báo người dùng một câu, không cần mở phiên mới.

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
- `list <object-plural> '<filter>' [max]`: như `get` nhưng tự lấy hết các trang (mặc định tối đa 200 bản ghi). `members`: danh sách người trong workspace (id, tên, email) để giao task.

## Bài viết (workflow phụ `ADMIN_SITE.md`)

Object riêng “Bài viết” (`articles`) do trợ lý tạo qua Metadata API (`/rest/metadata/objects`, `/rest/metadata/fields`). Cần API key có Role được sửa Data model (thường là Admin); khóa chỉ đọc/ghi bản ghi sẽ báo 401/403 ở bước tạo.

```
python3 scripts/tinacrm_rest.py <base_url> ensure-articles-schema --dry-run
python3 scripts/tinacrm_rest.py <base_url> ensure-articles-schema
python3 scripts/tinacrm_rest.py <base_url> upsert-article  '{"title":"…","keyword":"…","status":"PROPOSED","audience":"…","campaign":"…","ideaSource":"…"}'
python3 scripts/tinacrm_rest.py <base_url> upsert-article  '{"id":"<id>","status":"PUBLISHED","url":"https://…","publishedAt":"YYYY-MM-DD"}'
python3 scripts/tinacrm_rest.py <base_url> topic-digest    '{"since":"YYYY-MM-DD","industryField":"industry"}'
python3 scripts/tinacrm_rest.py <base_url> articles-report '{"since":"YYYY-MM-DD","until":"YYYY-MM-DD"}'
python3 scripts/tinacrm_rest.py <base_url> create-task     '{"title":"…","assigneeId":"<id>","companyId":"<id>","articleId":"<id>"}'
```

| Trường trên TinaCRM | Tên API | Kiểu | Khóa trong `upsert-article` |
|---|---|---|---|
| Tiêu đề | `name` | Text | `title` |
| Đường dẫn bài | `articleUrl` | Links | `url` |
| Từ khóa chính | `focusKeyword` | Text | `keyword` |
| Trạng thái | `articleStatus` | Select: `PROPOSED` Đề xuất, `DRAFT` Nháp, `PUBLISHED` Đã đăng, `UNPUBLISHED` Đã gỡ | `status` (nhận cả nhãn tiếng Việt) |
| Ngày đăng | `publishedAt` | Date | `publishedAt` |
| Ngành / nhóm khách | `audience` | Text | `audience` |
| Chiến dịch | `campaign` | Text | `campaign` (slug trong `campaigns/`) |
| Nguồn ý tưởng | `ideaSource` | Text | `ideaSource` |
| Tệp nháp | `draftPath` | Text | `draftPath` |
| Công ty / Người liên quan / Cơ hội | `companyId`, `personId`, `opportunityId` | Quan hệ nhiều-một | cùng tên |

- `ensure-articles-schema` kiểm tra theo tên API; chỉ tạo phần thiếu, không sửa hay xóa trường có sẵn, rồi đọc lại cấu trúc (`verified_missing` phải rỗng). Chạy lại nhiều lần không sao.
- Object mới tự có quan hệ với Task và Note, nên `create-task` gắn được `articleId` (qua `taskTargets.targetArticleId`).
- Phía Công ty / Người / Cơ hội có trường ngược “Bài viết” (tên API `baiViet`; workspace tạo lúc nhãn tiếng Việt bị từ chối thì là `articles`).
- `assigneeId` phải là id trong `members` của đúng workspace đang dùng; id của workspace khác báo lỗi `violates foreign key constraint`.
- Đã chạy thử trên app.tinacrm.com (12/11/2026): tạo object, trường, quan hệ, đổi trạng thái, task gắn bài, báo cáo tuần đều đúng.
- `upsert-article` tìm bản ghi theo `id`, rồi đường dẫn, rồi tiêu đề chính xác; chỉ cập nhật các khóa được truyền. Bản ghi mới mặc định `PROPOSED`.
- Người dùng muốn tự tạo trên giao diện (Settings → Data model → New object): dùng đúng tên API trong bảng (mục Advanced của từng trường), rồi chạy `ensure-articles-schema --dry-run` để kiểm tra.
- Ghi vào `config/business.json` → `crm.articles`: `status` (`ready` / `skipped`), `object_id`, `checked_at`.

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
