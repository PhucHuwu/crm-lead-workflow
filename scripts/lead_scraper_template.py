#!/usr/bin/env python3
"""
Template thu thập dữ liệu Lead an toàn với Session Cookie & Human-like Delay
Hỗ trợ xuất kết quả chuẩn JSON vào thư mục outputs/02_crawled_leads/
"""

import os
import json
import time
import random
from datetime import datetime

def crawl_leads_mock(criteria_path, output_path):
    print(f"[*] Đang tải bộ tiêu chí ICP từ: {criteria_path}")
    if os.path.exists(criteria_path):
        with open(criteria_path, "r", encoding="utf-8") as f:
            criteria = json.load(f)
            print(f"[+] Chiến dịch: {criteria.get('campaign_name', 'Mặc định')}")
    else:
        print("[!] Không tìm thấy file tiêu chí, dùng tiêu chuẩn mặc định.")

    print("[*] Đang khởi tạo kết nối an toàn với Session Cookie...")
    time.sleep(1)

    # Giả lập mẫu thu thập dữ liệu phù hợp tiêu chuẩn
    sample_leads = [
        {
            "id": f"lead_{int(time.time())}_1",
            "full_name": "Trần Thị Minh",
            "job_title": "Giám đốc Marketing (CMO)",
            "company_name": "Công ty Cổ phần Bán Lẻ An Phát",
            "company_size": "50-100",
            "industry": "Bán lẻ & Thương mại",
            "website": "https://anphatretail.vn",
            "email": "minh.tran@anphatretail.vn",
            "phone": "+84988776655",
            "location": "Hồ Chí Minh, Việt Nam",
            "source": "LinkedIn Outreach",
            "source_profile_url": "https://linkedin.com/in/minhtran-cmo",
            "icp_score": 90,
            "intent_signals": ["Đang mở rộng chuỗi cửa hàng", "Tìm giải pháp CRM"],
            "created_at": datetime.utcnow().isoformat() + "Z"
        }
    ]

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(sample_leads, f, ensure_ascii=False, indent=2)

    print(f"[SUCCESS] Đã lưu {len(sample_leads)} lead vào {output_path}")

if __name__ == "__main__":
    criteria_file = "outputs/01_icp_criteria/icp_criteria.json"
    output_file = "outputs/02_crawled_leads/leads_raw.json"
    crawl_leads_mock(criteria_file, output_file)
