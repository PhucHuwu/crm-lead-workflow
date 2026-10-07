# ĐỊNH DẠNG DỮ LIỆU CHUẨN (DATA SCHEMAS)

Bộ quy chuẩn JSON Schema cho các dữ liệu luân chuyển trong hệ thống.

---

## 1. TIÊU CHÍ KHÁCH HÀNG TIỀM NĂNG (outputs/01_icp_criteria/icp_criteria.json)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ICPCriteria",
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "campaign_name": { "type": "string" },
    "target_industry": { "type": "array", "items": { "type": "string" } },
    "company_size": {
      "type": "object",
      "properties": {
        "min_employees": { "type": "integer" },
        "max_employees": { "type": "integer" }
      }
    },
    "geography": { "type": "array", "items": { "type": "string" } },
    "decision_maker_titles": { "type": "array", "items": { "type": "string" } },
    "intent_signals": { "type": "array", "items": { "type": "string" } },
    "negative_keywords": { "type": "array", "items": { "type": "string" } },
    "scoring_weights": {
      "type": "object",
      "properties": {
        "title_match": { "type": "number" },
        "industry_match": { "type": "number" },
        "company_size_match": { "type": "number" },
        "intent_signal_match": { "type": "number" }
      }
    }
  }
}
```

---

## 2. DỮ LIỆU LEAD CÀO ĐƯỢC (outputs/02_crawled_leads/leads_raw.json)
```json
[
  {
    "id": "lead_001",
    "full_name": "Nguyễn Văn A",
    "job_title": "Giám đốc Vận hành (COO)",
    "company_name": "Công ty Cổ phần TechLogistics",
    "company_size": "50-200",
    "industry": "Vận tải & Logistics",
    "website": "https://techlogistics.vn",
    "email": "a.nguyen@techlogistics.vn",
    "phone": "+84912345678",
    "location": "Hà Nội, Việt Nam",
    "source": "LinkedIn",
    "source_profile_url": "https://linkedin.com/in/nguyen-van-a",
    "icp_score": 88,
    "intent_signals": ["Đang tuyển dụng nhân viên điều phối", "Mở rộng kho bãi"],
    "created_at": "2026-10-06T08:30:00Z"
  }
]
```

---

## 3. PAYLOAD GỬI CRM WEBHOOK (BƯỚC 9)
```json
{
  "action": "create_or_update_lead",
  "data": {
    "source": "Claude Auto Pipeline",
    "full_name": "Nguyễn Văn A",
    "job_title": "Giám đốc Vận hành (COO)",
    "company_name": "Công ty Cổ phần TechLogistics",
    "email": "a.nguyen@techlogistics.vn",
    "phone": "+84912345678",
    "website": "https://techlogistics.vn",
    "location": "Hà Nội",
    "lead_score": 88,
    "status": "New Lead",
    "notes": "Quan tâm đến giải pháp quản trị đội xe và tiết kiệm chi phí"
  }
}
```

---

## 4. PAYLOAD TẠO TASK TRÊN CRM KHI CÓ PHẢN HỒI (BƯỚC 12)
```json
{
  "action": "create_cskh_task",
  "data": {
    "task_title": "HOT: Khách hàng phản hồi email chăm sóc - TechLogistics",
    "priority": "HIGH",
    "lead_email": "a.nguyen@techlogistics.vn",
    "lead_name": "Nguyễn Văn A",
    "company": "Công ty Cổ phần TechLogistics",
    "customer_reply_summary": "Khách muốn đặt lịch demo vào 14:00 chiều Thứ Năm tuần này",
    "assigned_to": "sales_team@company.com",
    "due_date": "2026-10-06T12:00:00Z",
    "status": "Pending"
  }
}
```
