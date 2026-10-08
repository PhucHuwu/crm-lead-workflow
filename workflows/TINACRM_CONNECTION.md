# Kết nối TinaCRM theo source thực tế

Khảo sát source tại `/Users/phuc/Coding/Git/tina_crm`. Kết luận này mô tả mã nguồn local, không xác nhận cấu hình reverse proxy hoặc phiên bản đang triển khai.

## Phương án ưu tiên cho Claude Desktop

TinaCRM đã có MCP native tại `<server-base-url>/mcp`. Ưu tiên kiểm tra và dùng server đó trước khi xây connector CRM riêng. Trong Settings → MCP & APIs → MCP, giao diện có Quick install → Claude → Install. Link mở `claude.ai/customize/connectors` và điền tên/URL, không tự đăng nhập hay cấp quyền. Link chỉ bật khi URL MCP là HTTPS. Tên connector hiện vẫn là Twenty trong source, dù sản phẩm mang tên TinaCRM.

Server có OAuth discovery và Bearer authentication. Luồng đăng nhập/cấp quyền trên Claude phải được thử với deployment và phiên bản client thực tế. Nếu OAuth không dùng được, người hỗ trợ cấu hình client/bridge cục bộ hỗ trợ Bearer API key; không giả định thêm `url` vào `claude_desktop_config.json` là được mọi phiên bản hỗ trợ.

MCP có tool catalog/discovery và thực thi theo Role. Cần initialize, tools/list, học catalog/schema và thử đọc trước; không giả định tất cả công cụ CRM/email đều được cấp hoặc hiện ngay trong danh sách đầu tiên.

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
3. Nếu dùng API key: tạo với Name, Role, Expiration Date. Chọn Role đáp ứng đọc schema, đọc/ghi object cần dùng và tạo/liên kết task. Cấu hình token ngoài chat.
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

Đã đối chiếu source; chưa thử với instance TinaCRM thật và credential thật. File `business.example.json` là hợp đồng cấu hình cho workflow; các script mẫu không tự đọc cấu hình hoặc tự tạo kết nối MCP.
