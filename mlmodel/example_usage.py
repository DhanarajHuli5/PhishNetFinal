#!/usr/bin/env python3
"""
Example script to demonstrate how to use the URL Phishing Detection API.
This script sends test URLs to the API and displays the results.
"""

import requests
import json
import time

# API endpoint
API_URL = "http://localhost:8000/analyze"

# Test URLs - a mix of legitimate and potentially suspicious URLs
test_urls = [
    "https://www.google.com",
    "https://www.microsoft.com",
    "http://paypal-secure-login.com-account.info/login.html",
    "http://192.168.1.1/admin",
    "https://www.amazon.com/login?redirect=https%3A%2F%2Fphishing-site.com",
    "https://www.facebook.com"
]

def analyze_url(url):
    """Send a URL to the phishing detection API and return the results."""
    payload = {"url": url}
    headers = {"Content-Type": "application/json"}
    
    try:
        print(f"\nAnalyzing URL: {url}")
        response = requests.post(API_URL, data=json.dumps(payload), headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            return result
        else:
            print(f"Error: API returned status code {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to API: {e}")
        print("Make sure the API server is running (uvicorn predict_service:app --reload)")
        return None

def display_results(result):
    """Display the key information from the API response."""
    if not result:
        return
    
    # Extract key information
    url = result["url"]
    is_phishing = result["ml_prediction"]["is_phishing"]
    probability = result["ml_prediction"]["phishing_probability"]
    risk_level = result["risk_factors"]["overall_risk"]
    risk_factors = result["risk_factors"]["risk_factors"]
    
    # Display results
    print("\n" + "="*50)
    print(f"URL: {url}")
    print(f"Phishing Detection: {'YES' if is_phishing else 'NO'}")
    print(f"Confidence: {probability:.4f}")
    print(f"Risk Level: {risk_level}")
    
    if risk_factors:
        print("\nRisk Factors Identified:")
        for factor in risk_factors:
            print(f"- {factor}")
    else:
        print("\nNo specific risk factors identified.")
    
    # Display some additional details
    print("\nAdditional Details:")
    
    # Safely access whois_info if it exists
    if 'url_analysis' in result and 'whois_info' in result['url_analysis']:
        print(f"- Domain Age: {result['url_analysis']['whois_info'].get('age_days', 'Unknown')} days")
    else:
        print("- Domain Age: Unknown (possibly IP address or local domain)")
    
    # Check if security_checks exists before accessing
    if 'url_analysis' in result and 'security_checks' in result['url_analysis']:
        print(f"- Uses HTTPS: {result['url_analysis']['security_checks'].get('uses_https', False)}")
        
        # Safely access suspicious words
        if 'suspicious_words' in result['url_analysis']['security_checks']:
            suspicious_words = result['url_analysis']['security_checks']['suspicious_words'].get('words', [])
            if suspicious_words:
                print(f"- Suspicious Words: {', '.join(suspicious_words)}")
    
    print("="*50)

def main():
    """Main function to test the API with multiple URLs."""
    print("URL Phishing Detection API Test")
    print("==============================")
    print("Checking if API is available...")
    
    # Test connection to API
    try:
        response = requests.get("http://localhost:8000/")
        if response.status_code != 200:
            print("API is not responding correctly. Please ensure the service is running.")
            return
    except requests.exceptions.ConnectionError:
        print("Could not connect to API. Please start the service with:")
        print("cd ml_service && uvicorn predict_service:app --reload")
        return
    
    print("API is available! Testing with sample URLs...\n")
    
    # Test each URL
    for url in test_urls:
        try:
            result = analyze_url(url)
            if result:
                display_results(result)
                time.sleep(1)  # Small delay between requests
        except Exception as e:
            print(f"Error processing {url}: {str(e)}")
    
    print("\nTesting completed!")

if __name__ == "__main__":
    main() 