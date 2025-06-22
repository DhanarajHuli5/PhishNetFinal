# URL Phishing Detection System - User Manual

## Overview

This URL Phishing Detection System uses machine learning to analyze URLs and determine if they are potentially phishing attempts. The system extracts various features from URLs including structure, domain information, security features, and lexical patterns to make accurate predictions.

## System Requirements

- Python 3.8 or higher
- Required Python packages (installed via `requirements.txt`):
  - FastAPI
  - uvicorn
  - scikit-learn
  - pandas
  - joblib
  - pydantic
  - python-whois
  - requests
  - beautifulsoup4
  - pyOpenSSL

## Getting Started

### 1. Clone or Download the Project

Ensure you have the complete project structure with these key components:
- `ml_service/` directory containing the ML service
- `Datset/` directory containing the training data

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
cd ml_service
pip install -r requirements.txt
```

### 3. Start the ML Service

Start the FastAPI service which exposes the URL analysis endpoint:

```bash
cd ml_service
uvicorn predict_service:app --reload
```

You should see output indicating the service is running at `http://127.0.0.1:8000`.

## Using the URL Analysis API

### Endpoint: `/analyze`

This endpoint accepts POST requests with a JSON payload containing a URL to analyze.

#### Request Format

```json
{
  "url": "https://example.com"
}
```

#### Example Usage

**Using PowerShell:**

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8000/analyze" -Method POST -ContentType "application/json" -Body '{"url": "https://example.com"}'
$response.Content
```

**Using curl (Linux/Mac):**

```bash
curl -X POST "http://localhost:8000/analyze" -H "Content-Type: application/json" -d '{"url": "https://example.com"}'
```

**Using Python:**

```python
import requests
import json

url = "http://localhost:8000/analyze"
payload = {"url": "https://example.com"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers)
result = response.json()
print(json.dumps(result, indent=2))
```

### Response Format

The API returns a JSON response with detailed analysis:

```json
{
  "url": "https://example.com/",
  "ml_prediction": {
    "is_phishing": false,
    "phishing_probability": 0.24,
    "extracted_features": {
      "url_length": 22,
      "hostname_length": 11,
      "path_length": 1,
      "count_dots": 1,
      "count_hyphens": 0,
      "count_at": 0,
      "count_question": 0,
      "count_percent": 0,
      "count_equals": 0,
      "count_https": 1,
      "has_https_token": 0,
      "is_ip": 0,
      "has_suspicious_words": 0,
      "num_subdomains": 0,
      "uses_https": 1
    }
  },
  "url_analysis": {
    "url_structure": {
      "scheme": "https",
      "domain": "example.com",
      "path": "/",
      "query": "",
      "parameters": {},
      "top_level_domain": "com",
      "subdomain": ""
    },
    "whois_info": {
      "registrar": "Example Registrar",
      "creation_date": "1995-08-14 04:00:00",
      "expiration_date": "2025-08-13 04:00:00",
      "last_updated": "2023-08-14 09:00:00",
      "status": ["clientDeleteProhibited", "clientTransferProhibited"],
      "name_servers": ["ns1.example.com", "ns2.example.com"],
      "age_days": 10000
    },
    "ssl_info": {
      "issuer": {
        "countryName": "US",
        "organizationName": "DigiCert Inc",
        "commonName": "DigiCert TLS RSA SHA256 2020 CA1"
      },
      "subject": {
        "commonName": "example.com"
      },
      "version": 3,
      "valid_from": "Jun 10 00:00:00 2025 GMT",
      "valid_until": "Jul 10 23:59:59 2025 GMT",
      "has_ssl": true
    },
    "content_analysis": {
      "title": "Example Domain",
      "meta_tags": {},
      "external_links": 1,
      "forms": 0,
      "login_forms": 0
    },
    "security_checks": {
      "uses_https": true,
      "is_ip_address": false,
      "suspicious_words": {
        "found": false,
        "words": []
      },
      "length_checks": {
        "total_length": 22,
        "domain_length": 11,
        "path_length": 1
      }
    }
  },
  "risk_factors": {
    "total_risks_found": 0,
    "risk_factors": [],
    "overall_risk": "Low"
  }
}
```

## Understanding the Results

### ML Prediction

- **is_phishing**: Boolean indicating if the URL is classified as phishing
- **phishing_probability**: Probability score from 0 to 1 (higher values indicate higher risk)
- **extracted_features**: Features extracted from the URL used by the ML model

### URL Analysis

- **url_structure**: Breakdown of URL components
- **whois_info**: Domain registration information
- **ssl_info**: SSL certificate details
- **content_analysis**: Analysis of the webpage content
- **security_checks**: Various security indicators

### Risk Factors

- **total_risks_found**: Number of risk factors identified
- **risk_factors**: List of specific risk factors
- **overall_risk**: Risk assessment (Low, Medium, High)

## Common Risk Indicators

1. **Suspicious URL Structure**
   - Excessive subdomains
   - Long domain names
   - IP addresses instead of domain names
   - Unusual characters in domain

2. **Domain Issues**
   - Recently created domains (less than 6 months old)
   - Domains with no WHOIS information
   - Domains with short expiration periods

3. **Security Red Flags**
   - Missing HTTPS
   - Invalid SSL certificates
   - Suspicious words (login, account, secure, bank, etc.)
   - Redirect chains

4. **Content Concerns**
   - Login forms submitting to different domains
   - Hidden form fields
   - Excessive external links
   - Mismatched branding

## Interpreting Risk Levels

- **Low Risk**: Few or no suspicious indicators, likely legitimate
- **Medium Risk**: Some suspicious patterns, exercise caution
- **High Risk**: Multiple risk factors, likely phishing attempt

## Troubleshooting

### Common Issues

1. **Service Won't Start**
   - Ensure all dependencies are installed
   - Check if port 8000 is already in use
   - Verify Python version compatibility

2. **Analysis Errors**
   - Ensure URL is properly formatted (include http:// or https://)
   - Check internet connectivity for WHOIS and content analysis
   - Some websites may block automated requests

3. **Model Warnings**
   - "X does not have valid feature names" warnings are normal and don't affect functionality

## Advanced Usage

### Retraining the Model

If you want to retrain the model with updated data:

```bash
cd ml_service
python train_model.py
```

This will generate a new `phishing_lr_model.joblib` file.

### Customizing the Service

You can modify the `predict_service.py` file to adjust risk thresholds or add additional analysis features.

## Support

For any issues or questions, please refer to the project documentation or contact the development team. 