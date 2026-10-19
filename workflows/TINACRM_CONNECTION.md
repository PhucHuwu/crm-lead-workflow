# Kết nối TinaCRM theo source thực tế

Khảo sát source tại `/Users/phuc/Coding/Git/tina_crm`. Kết luận này mô tả mã nguồn local, không xác nhận cấu hình reverse proxy hoặc phiên bản đang triển khai.

## Phương án ưu tiên cho Claude Desktop

TinaCRM đã có MCP native tại `<server-base-url>/mcp`. Ưu tiên kiểm tra và dùng server đó trước khi xây connector CRM riêng. Trong Settings → MCP & APIs → MCP, giao diện có Quick install → Claude → Install. Link mở `claude.ai/customize/connectors` và điền tên/URL, không tự đăng nhập hay cấp quyền. Link chỉ bật khi URL MCP là HTTPS. Tên connector hiện vẫn là Twenty trong source, dù sản phẩm mang tên TinaCRM.

Server có OAuth discovery và Bearer authentication. Luồng đăng nhập/cấp quyền trên Claude phải được thử với deployment và phiên bản client thực tế. Nếu OAuth không dùng được, người hỗ trợ cấu hình client/bridge cục bộ hỗ trợ Bearer API key; không giả định thêm `url` vào `claude_desktop_config.json` là được mọi phiên bản hỗ trợ.

MCP có tool catalog/discovery và thực thi theo Role. Cần initialize, tools/list, học catalog/schema và thử đọc trước; không giả định tất cả công cụ CRM/email đều được cấp hoặc hiện ngay trong danh sách đầu tiên.

## Thiết lập MCP với API key (cách mặc định trong Claude Code)

Dữ liệu lead vẫn đọc/ghi qua **MCP native** của TinaCRM; API key chỉ là thông tin xác thực để MCP biết workspace và Role. Không dùng REST thay MCP khi MCP hoạt động.

1. Hỏi địa chỉ TinaCRM. URL MCP là `<server-base-url>/mcp` (xem Settings → MCP & APIs → tab MCP; backend có thể khác domain giao diện). Ghi `crm.base_url`, `crm.mcp_url`, `crm.auth_method: "api_key_headers_helper"`, `crm.credential_reference: "config/tinacrm_api_key.txt"` vào `config/business.json`.
2. Bật hộp thoại lưu khóa, chọn lệnh theo hệ điều hành:
   - macOS: `sh scripts/tinacrm_save_key.sh <mcp_url>`
   - Windows: `powershell -NoProfile -ExecutionPolicy Bypass -STA -File scripts/tinacrm_save_key.ps1 <mcp_url>` (chạy được từ Git Bash lẫn PowerShell)

   Nói trước với người dùng: "Một hộp thoại Kết nối TinaCRM sẽ hiện ra, dán khóa vào ô và bấm Lưu". Script lưu khóa vào `config/tinacrm_api_key.txt` (gitignore), không in khóa, và chỉ lưu khi TinaCRM chấp nhận khóa (khóa cũ giữ nguyên nếu bị từ chối). Không bắt người dùng tự tìm hoặc mở tệp. Hộp thoại bị che thì nhắc tìm trên thanh Dock (macOS) hoặc thanh tác vụ (Windows). Kết quả "Đã hủy" thì hỏi lại; "từ chối" thì tạo khóa mới và chạy lại.
3. Thêm server vào `.mcp.json` ở thư mục gốc theo `config/tinacrm_mcp.template.json` (macOS) hoặc `config/tinacrm_mcp.windows.template.json` (Windows), giữ các server có sẵn như `workflow-cloakbrowser`. `headersHelper` chạy `scripts/tinacrm_auth_header.sh` hoặc `.ps1`, đọc khóa và gửi `Authorization: Bearer <token>`. Không ghi khóa trực tiếp vào `.mcp.json` hoặc `headers`.
4. Nhờ người dùng mở phiên mới (+ New) trong cùng thư mục và chấp nhận hộp thoại tin cậy thư mục nếu có; headersHelper của project chỉ chạy khi thư mục đã được tin cậy.
5. Kiểm tra server `tinacrm` đã kết nối và có công cụ; thử đọc schema/một vài bản ghi, chưa ghi dữ liệu.
6. Lỗi 401/403: khóa sai, hết hạn hoặc đã xóa → người dùng tạo khóa mới, Claude chạy lại script lưu khóa ở bước 2. Lỗi kết nối: kiểm tra URL `/mcp` và HTTPS.

Bản Windows dùng Windows PowerShell 5.1 có sẵn (Windows Forms), không cần Git Bash hay Python; tệp `.ps1` lưu UTF-8 có BOM để hiện đúng tiếng Việt, đừng lưu lại không BOM. Bản Windows chưa được chạy thử trên máy Windows thật. Phương án OAuth/connector (mục dưới) vẫn dùng được nếu deployment hỗ trợ.

## Ba cơ chế khác nhau

| Cơ chế | Đường dẫn trong source | Xác thực và workspace | Dùng để làm gì |
|---|---|---|---|
| Data API | `/rest/<object-plural>`; batch `/rest/batch/<object-plural>` | `Authorization: Bearer <API-key-token>`; workspace lấy từ token; quyền phụ thuộc Role | Đọc/tạo/cập nhật dữ liệu theo schema thực tế |
| Native MCP | `/mcp` (POST, JSON-RPC; JSON/SSE tùy Accept) | Bearer qua JWT guard; API key có Role hoặc ngữ cảnh user/application phù hợp | Claude khám phá và thao tác công cụ CRM |
| Workflow trigger inbound | `/webhooks/workflows/:workspaceId/:workflowId` (GET/POST) | `PublicEndpointGuard` + `NoPermissionGuard`; không kiểm tra Bearer trong controller này | Chạy workflow WEBHOOK đang ACTIVE, payload POST vào workflow |
| Quản lý outbound webhook | `/rest/webhooks`, `/rest/metadata/webhooks` | JWT + workspace + quyền `API_KEYS_AND_WEBHOOKS` | Đăng ký CRM gửi sự kiện ra target URL, không nhập lead |

Workspace vẫn tồn tại trong mô hình Twenty. Với API key, JWT do server ký chứa `sub`, `workspaceId`, type `API_KEY` và `jti`; server xác minh token, key có bị thu hồi/hết hạn không và tìm workspace từ token. Không bắt người dùng lowtech tìm/nhập workspace ID để gọi REST/MCP. `resolved_workspace_id` chỉ là thông tin đã đối chiếu nếu công cụ cung cấp, không phải tham số xác thực độc lập.

API key ID không phải token để gửi request. UI tạo key rồi gọi `generateApiKeyToken`; lưu token nguyên bản trong credential cục bộ, connector thêm tiền tố Bearer. Không dùng access token đăng nhập ngắn hạn làm mặc định cho automation.

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

## Thiết lập và kiểm chứng

1. Người dùng cung cấp địa chỉ TinaCRM; kiểm tra server URL trong Settings, không đoán từ frontend URL khi backend tách domain.
2. Hướng dẫn mở MCP & APIs, thử Install của Claude và đăng nhập/cấp quyền đúng doanh nghiệp.
3. Nếu dùng API key: tạo với Name, Role, Expiration Date. Chọn Role đáp ứng đọc schema, đọc/ghi object cần dùng và tạo/liên kết task. Cấu hình token ngoài chat theo mục “Thiết lập MCP với API key”.
4. Xác minh ngữ cảnh doanh nghiệp qua kết quả có sẵn và người dùng, không chỉ decode token rồi coi là đã xác thực.
5. Khám phá object và trường thực tế qua tools/schema; tìm Person/Company/lead custom object và quan hệ task.
6. Thử đọc không thay đổi dữ liệu; sau đó thử ghi mẫu được thống nhất, đọc lại và kiểm tra chạy lại không tạo trùng.
7. Phân biệt lỗi: token thiếu/sai/hết hạn, thiếu Role/quyền, URL/proxy, schema/payload và workflow chưa ACTIVE. Không gộp mọi lỗi thành “workspace chưa cấu hình”.

## Source tham chiếu (relative to tina_crm)

- `packages/twenty-server/src/engine/core-modules/api-key/services/api-key.service.ts`: token và Role; dòng 98–164 kiểm tra/generate.
- `packages/twenty-server/src/engine/core-modules/auth/strategies/jwt.auth.strategy.ts`: validateAPIKey, dòng 63–101.
- `packages/twenty-server/src/engine/core-modules/jwt/services/jwt-wrapper.service.ts`: Bearer extraction.
- `packages/twenty-server/src/engine/api/rest/core/controllers/rest-api-core.controller.ts`: data REST guards/routes.
- `packages/twenty-server/src/engine/api/mcp/controllers/mcp-core.controller.ts`, `guards/mcp-auth.guard.ts`, `services/mcp-protocol.service.ts`: native MCP, discovery và Role.
- `packages/twenty-server/src/engine/core-modules/workflow/controllers/workflow-trigger.controller.ts`: public workflow URL, ACTIVE checks và run ID.
- `packages/twenty-server/src/engine/metadata-modules/webhook/controllers/webhook.controller.ts`, `jobs/call-webhook.job.ts`: quản lý và ký outbound events.
- `packages/twenty-front/src/pages/settings/api-webhooks/SettingsApiWebhooks.tsx`: tabs, Create API key.
- `packages/twenty-front/src/pages/settings/developers/api-keys/SettingsDevelopersApiKeysNew.tsx`: Name, Role, Expiration Date.
- `packages/twenty-front/src/modules/settings/mcp-and-apis/utils/mcpSetup.ts`, `buildMcpSetupCategories.tsx`: URL `/mcp`, Claude Install link, HTTPS.

## Trạng thái

Thử thật 2026-10-19 với API key (Bearer) trên một workspace TinaCRM cloud:

- `initialize` thành công (cả `<workspace>.tinacrm.com/mcp` và `api.tinacrm.com/mcp`); xác thực API key qua MCP hoạt động.
- `tools/list` và `tools/call` lỗi `-32603 Missing MCP annotations for preloaded tool "extract_json_paths"`. Nguyên nhân trong source: `COMMON_PRELOAD_TOOLS` có `extract_json_paths`, `search_output` nhưng `MCP_PRELOADED_TOOL_ANNOTATIONS` trong `mcp-protocol.service.ts` chỉ khai báo `search_help_center`. Cần sửa phía server trước khi Claude dùng được công cụ MCP.
- REST cùng khóa đọc được `people`, `companies`, `tasks`, `opportunities` (phương án dự phòng chỉ đọc khi MCP còn lỗi).

Chưa thử ghi dữ liệu và chưa thử qua Claude Code (`.mcp.json` + headersHelper). File `business.example.json` là hợp đồng cấu hình cho workflow; các script mẫu không tự đọc cấu hình hoặc tự tạo kết nối MCP.
