import re
from urllib.parse import urlparse

class URLFeatureExtractor:
    """
    Extracts features from URLs for phishing detection.
    """
    def __init__(self, url):
        self.url = url
        self.parsed = urlparse(url)

    def get_features(self):
        """
        Extracts a set of features from the URL.
        Returns:
            dict: Feature name to value mapping.
        """
        features = {
            'url_length': len(self.url),
            'hostname_length': len(self.parsed.hostname) if self.parsed.hostname else 0,
            'path_length': len(self.parsed.path),
            'count_dots': self.url.count('.'),
            'count_hyphens': self.url.count('-'),
            'count_at': self.url.count('@'),
            'count_question': self.url.count('?'),
            'count_percent': self.url.count('%'),
            'count_equals': self.url.count('='),
            'count_https': self.url.lower().count('https'),
            'has_https_token': int('https' in self.url.lower() and not self.url.startswith('https://')),
            'is_ip': int(self.is_ip_address()),
            'has_suspicious_words': int(self.has_suspicious_words()),
            'num_subdomains': self.get_num_subdomains(),
            'uses_https': int(self.parsed.scheme == 'https'),
        }
        return features

    def is_ip_address(self):
        # Check if the hostname is an IP address
        if self.parsed.hostname:
            return bool(re.match(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", self.parsed.hostname))
        return False

    def has_suspicious_words(self):
        # Common phishing words
        suspicious = ['login', 'verify', 'update', 'free', 'security', 'ebayisapi', 'webscr']
        return any(word in self.url.lower() for word in suspicious)

    def get_num_subdomains(self):
        if self.parsed.hostname:
            return len(self.parsed.hostname.split('.')) - 2
        return 0 