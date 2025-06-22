# Phishing URL Detection Project

This project detects phishing URLs using a machine learning model and provides a comprehensive analysis of URL security features.

## Structure

```
AI_ML_Model/
│
├── backend/                # Node.js backend (API, authentication, MongoDB)
├── ml_service/             # Python ML service (feature extraction, model, API)
├── Datset/                 # Dataset folder
│   └── PhiUSIIL_Phishing_URL_Dataset.csv
├── UserManual.md           # Detailed user manual
├── example_usage.py        # Example Python script to test the API
└── README.md               # Project overview (this file)
```

## Components

### 1. Python ML Service (`ml_service/`)
- Trains a Logistic Regression model on your dataset.
- Extracts features from URLs.
- Serves predictions via FastAPI.
- See `ml_service/README.md` for details.

### 2. Node.js Backend (`backend/`)
- Handles user authentication (JWT, bcryptjs).
- Provides an endpoint to check URLs (calls the Python ML service).
- Stores user and query logs in MongoDB.
- (To be implemented)

## Setup

1. **Clone the repo and navigate to the project root.**
2. **Prepare the Python ML service:**
   - See `ml_service/README.md` for setup, training, and running the prediction API.
   - Install required dependencies: `cd ml_service && pip install -r requirements.txt`

## Usage

### Quick Start

1. Start the ML service:
```bash
cd ml_service
uvicorn predict_service:app --reload
```

2. Test the service using the provided example script:
```bash
python example_usage.py
```

3. Or send requests directly:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8000/analyze" -Method POST -ContentType "application/json" -Body '{"url": "https://example.com"}'
$response.Content
```

### Detailed Documentation

For detailed instructions on how to use the system, please refer to:

- **UserManual.md**: Complete documentation on system setup, API usage, and result interpretation
- **example_usage.py**: Sample Python script demonstrating how to interact with the API

## Features

The URL phishing detection system provides:

- Machine learning-based phishing detection
- Detailed URL structure analysis
- Domain registration (WHOIS) information
- SSL certificate verification
- Content analysis
- Risk factor identification
- Overall risk assessment

---

## Authors & License
- Your Name
- MIT License (or specify) 