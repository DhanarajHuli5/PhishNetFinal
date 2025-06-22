import pandas as pd
import joblib
from feature_extraction import URLFeatureExtractor
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import os

"""
Script to train a Logistic Regression model for phishing URL detection.
"""

def extract_features_from_df(df, url_col):
    features = []
    total = len(df)
    for idx, url in enumerate(df[url_col]):
        try:
            if idx % 100 == 0:
                print(f"Processing URL {idx}/{total}...")
            extractor = URLFeatureExtractor(url)
            features.append(extractor.get_features())
        except Exception as e:
            print(f"Error extracting features for URL {url}: {str(e)}")
            features.append(None)
    return pd.DataFrame([f for f in features if f is not None])

def main():
    # Load dataset
    data_path = os.path.join('..', 'Datset', 'PhiUSIIL_Phishing_URL_Dataset.csv')
    print("Loading dataset...")
    
    try:
        df = pd.read_csv(data_path)
    except UnicodeDecodeError:
        print("Trying with different encoding...")
        df = pd.read_csv(data_path, encoding='latin1')
    
    # Print information about the dataset
    print("\nDataset Info:")
    print(df.info())
    
    print("\nFirst few rows:")
    print(df.head())
    
    print("\nAvailable columns:", df.columns.tolist())
    
    # Try to identify URL and label columns
    url_col = None
    label_col = None
    
    # Common names for URL columns
    url_columns = ['url', 'URL', 'urls', 'domain', 'Domain', 'website', 'Website']
    for col in url_columns:
        if col in df.columns:
            url_col = col
            break
    
    # Common names for label columns
    label_columns = ['label', 'Label', 'class', 'Class', 'phishing', 'Phishing', 'is_phishing', 'type', 'Type']
    for col in label_columns:
        if col in df.columns:
            label_col = col
            break
    
    if not url_col or not label_col:
        print("\nCouldn't automatically identify columns.")
        print("Available columns:", df.columns.tolist())
        url_col = input("Enter URL column name: ")
        label_col = input("Enter label column name: ")
    
    if url_col not in df.columns or label_col not in df.columns:
        raise ValueError(f"Could not find columns. Available columns: {df.columns.tolist()}")
    
    print(f"\nUsing columns: URL='{url_col}', Label='{label_col}'")
    
    # Sample a subset for testing
    print("\nSampling 1000 URLs for testing...")
    df = df.sample(n=min(1000, len(df)), random_state=42)
    
    # Extract features
    print("Extracting features...")
    X = extract_features_from_df(df, url_col)
    y = df[label_col]
    
    print(f"\nExtracted features for {len(X)} URLs")
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    print("\nTraining model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    print("\nAccuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model
    model_path = 'phishing_lr_model.joblib'
    joblib.dump(model, model_path)
    print(f"\nModel saved as {model_path}")

if __name__ == '__main__':
    main() 