# History mock endpoint
@app.get("/api/history")
def get_history():
    return [
        {
            "id": "1",
            "company_name": "Stripe Inc",
            "domain": "stripe.com",
            "agent": "ZoomInfo Agent",
            "disposition": "Enriched",
            "remarks": "All data matched.",
            "headquarters": "San Francisco, CA",
            "created_at": "2026-01-21T10:15:00"
        },
        {
            "id": "2",
            "company_name": "Figma",
            "domain": "figma.com",
            "agent": "RocketReach Agent",
            "disposition": "Skipped",
            "remarks": "Domain not found in dataset.",
            "headquarters": "San Francisco, CA",
            "created_at": "2026-01-21T11:00:00"
        },
        {
            "id": "3",
            "company_name": "Acme Corporation",
            "domain": "acme-corp.com",
            "agent": "Validation Agent",
            "disposition": "Failed",
            "remarks": "Email validation failed.",
            "headquarters": "New York, NY",
            "created_at": "2026-01-21T12:30:00"
        },
        {
            "id": "4",
            "company_name": "Rocket Labs",
            "domain": "rocketlabs.com",
            "agent": "Automation Engine",
            "disposition": "Invalid Email",
            "remarks": "Invalid email format detected.",
            "headquarters": "Austin, TX",
            "created_at": "2026-01-21T13:45:00"
        },
        {
            "id": "5",
            "company_name": "PurpleTech",
            "domain": "purpletech.com",
            "agent": "ZoomInfo Agent",
            "disposition": "Duplicate",
            "remarks": "Duplicate record found.",
            "headquarters": "Seattle, WA",
            "created_at": "2026-01-21T14:10:00"
        }
    ]
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io
import csv
from typing import List

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI backend!"}

# Example POST endpoint
@app.post("/api/echo")
def echo(data: dict):
    return {"you_sent": data}

# Dashboard mock endpoint
@app.get("/api/dashboard")
def get_dashboard():
    return {
        "total_leads": 12543,
        "enriched_leads": 10892,
        "failed_enrichments": 342,
        "active_campaigns": 18,
        "enrichments_over_time": [300, 400, 380, 420, 500, 600, 580],
        "success_vs_failed": {
            "ZoomInfo": [4500, 200],
            "RocketReach": [3200, 150],
            "Buildata": [2500, 100]
        },
        "recent_activity": [
            {"domain": "stripe.com", "status": "Success", "source": "ZoomInfo", "timestamp": "2 min ago"},
            {"domain": "figma.com", "status": "Success", "source": "RocketReach", "timestamp": "5 min ago"}
        ]
    }

# Enrichments mock endpoint
@app.get("/api/enrichments")
def get_enrichments():
    return [
        {"company": "Stripe Inc", "domain": "stripe.com", "zoominfo": "Success", "rocketreach": "Success", "email_pattern": "{first}@stripe.com", "last_updated": "2 hours ago"},
        {"company": "Figma", "domain": "figma.com", "zoominfo": "Success", "rocketreach": "Pending", "email_pattern": "{first}.{last}@figma.com", "last_updated": "3 hours ago"},
        {"company": "Acme Corporation", "domain": "acme-corp.com", "zoominfo": "Failed", "rocketreach": "Failed", "email_pattern": "-", "last_updated": "5 hours ago"}
    ]

# Contacts mock endpoint
@app.get("/api/contacts")
def get_contacts():
    return [
        {"name": "Sarah Chen", "company": "Stripe Inc", "domain": "stripe.com", "email": "sarah@stripe.com", "phone": "+1 (555) 123-4567", "employees": "7,000+", "revenue": "$7.4B", "source": "ZoomInfo"},
        {"name": "Michael Rodriguez", "company": "Figma", "domain": "figma.com", "email": "michael.rodriguez@figma.com", "phone": "+1 (555) 234-5678", "employees": "800+", "revenue": "$400M", "source": "RocketReach"}
    ]

# Campaigns mock endpoint
@app.get("/api/campaigns")
def get_campaigns():
    return [
        {"name": "Q1 2026 Outreach", "contacts": 1247, "created": "Jan 15, 2026", "status": "Active", "completion": 68},
        {"name": "Enterprise Lead Gen", "contacts": 892, "created": "Jan 10, 2026", "status": "Active", "completion": 45}
    ]

# Settings mock endpoint
@app.get("/api/settings")
def get_settings():
    return {
        "company_name": "Acme Corporation",
        "timezone": "America/Los Angeles (PST)",
        "user_roles": [
            {"email": "john@company.com", "role": "Owner"},
            {"email": "sarah@company.com", "role": "Member"}
        ]
    }

# CSV upload endpoint
@app.post("/api/upload-csv")
def upload_csv(file: UploadFile = File(...)):
    content = file.file.read().decode('utf-8')
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    return {"rows": rows, "message": f"Received {len(rows)} rows."}

@app.post("/api/automation/start")
def start_automation(data: dict):
    # Here you would trigger your automation logic
    # For demo, just echo back the received data
    return {"status": "started", "received_rows": len(data.get("rows", []))}
