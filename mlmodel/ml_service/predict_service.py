from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
import joblib
from feature_extraction import URLFeatureExtractor
from url_analyzer import URLAnalyzer
import os

"""
FastAPI service for phishing URL prediction using a trained Logistic Regression model.
"""

app = FastAPI(
    title="URL Analysis & Phishing Detection API",
    description="Analyzes URLs for phishing and provides detailed security information."
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'phishing_lr_model.joblib')

# Load model at startup
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    print(f"Model not loaded: {e}")

class URLRequest(BaseModel):
    url: HttpUrl

@app.post("/analyze")
async def analyze_url(request: URLRequest):
    """
    Analyze a URL for phishing and security characteristics.
    Returns ML prediction and comprehensive URL analysis.
    """
    url = str(request.url)
    
    try:
        # Get ML prediction
        extractor = URLFeatureExtractor(url)
        features = extractor.get_features()
        
        if model:
            X = [list(features.values())]
            pred = model.predict(X)[0]
            score = float(model.predict_proba(X)[0][1])
        else:
            pred = None
            score = None

        # Get detailed URL analysis
        analyzer = URLAnalyzer(url)
        analysis = await analyzer.analyze()

        # Combine results
        result = {
            "url": url,
            "ml_prediction": {
                "is_phishing": bool(pred) if pred is not None else None,
                "phishing_probability": score,
                "extracted_features": features
            },
            "url_analysis": analysis,
            "risk_factors": _analyze_risk_factors(analysis, score)
        }

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _analyze_risk_factors(analysis, phishing_score):
    """Analyze various risk factors and provide a summary."""
    risk_factors = []
    
    # Domain age
    if analysis.get('whois_info', {}).get('age_days'):
        if analysis['whois_info']['age_days'] < 30:
            risk_factors.append("Domain is less than 30 days old")
    
    # SSL
    ssl_info = analysis.get('ssl_info', {})
    if not ssl_info.get('has_ssl'):
        risk_factors.append("No SSL certificate")
    
    # Suspicious URL characteristics
    security = analysis.get('security_checks', {})
    if security.get('is_ip_address'):
        risk_factors.append("URL contains IP address instead of domain name")
    
    suspicious = security.get('suspicious_words', {})
    if suspicious.get('found'):
        risk_factors.append(f"Contains suspicious words: {', '.join(suspicious['words'])}")
    
    # Content analysis
    content = analysis.get('content_analysis', {})
    if content.get('login_forms', 0) > 0 and not ssl_info.get('has_ssl'):
        risk_factors.append("Login form present without SSL")
    
    # ML Score
    if phishing_score is not None and phishing_score > 0.5:
        risk_factors.append(f"ML model indicates {phishing_score*100:.1f}% probability of phishing")
    
    return {
        "total_risks_found": len(risk_factors),
        "risk_factors": risk_factors,
        "overall_risk": "High" if len(risk_factors) > 2 else "Medium" if risk_factors else "Low"
    }

@app.get("/")
def read_root():
    return {
        "title": "URL Analysis & Phishing Detection API",
        "endpoints": {
            "/analyze": "POST - Analyze a URL for phishing and security characteristics"
        }
    } 