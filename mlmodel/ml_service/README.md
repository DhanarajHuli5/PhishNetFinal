# URL Analysis & Phishing Detection Service

This service provides comprehensive URL analysis and phishing detection using machine learning and various security checks.

## Features

- Machine Learning-based phishing detection
- WHOIS information
- SSL certificate analysis
- Domain age verification
- Content analysis
- Security risk assessment
- Suspicious pattern detection

## Setup

```bash
cd ml_service
pip install -r requirements.txt
```

## Training the Model

1. Place your dataset (CSV) in the `Datset` folder.
2. Run:
```bash
python train_model.py
```

## Running the API Service

```bash
uvicorn predict_service:app --reload
```

## API Usage

### Analyze URL

**Endpoint:** `POST /analyze`

**Request:**
```json
{
    "url": "http://example.com"
}
```

**Response:**
```json
{
    "url": "http://example.com",
    "ml_prediction": {
        "is_phishing": false,
        "phishing_probability": 0.12,
        "extracted_features": { ... }
    },
    "url_analysis": {
        "url_structure": { ... },
        "whois_info": { ... },
        "ssl_info": { ... },
        "content_analysis": { ... },
        "security_checks": { ... }
    },
    "risk_factors": {
        "total_risks_found": 1,
        "risk_factors": ["No SSL certificate"],
        "overall_risk": "Low"
    }
}
```

## Integration

The service can be easily integrated with other systems via its REST API. Example using Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/analyze",
    json={"url": "http://example.com"}
)
result = response.json()
```

## Files
- `feature_extraction.py`: ML feature extraction
- `url_analyzer.py`: Comprehensive URL analysis
- `train_model.py`: ML model training
- `predict_service.py`: FastAPI service 