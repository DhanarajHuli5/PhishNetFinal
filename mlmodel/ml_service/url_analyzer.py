import whois
import requests
import socket
import ssl
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from tld import get_tld
import re
import asyncio
import aiohttp
from dateutil.parser import parse

class URLAnalyzer:
    """
    Comprehensive URL analyzer that extracts detailed information about URLs.
    """
    def __init__(self, url):
        self.url = url
        self.parsed = urlparse(url)
        self.domain = self.parsed.netloc
        self.results = {}

    async def analyze(self):
        """
        Perform comprehensive URL analysis.
        Returns a dictionary with all analysis results.
        """
        try:
            # Basic URL structure
            self.results['url_structure'] = self._analyze_url_structure()
            
            # WHOIS information
            self.results['whois_info'] = self._get_whois_info()
            
            # SSL Certificate
            self.results['ssl_info'] = self._check_ssl()
            
            # Content analysis
            async with aiohttp.ClientSession() as session:
                async with session.get(self.url) as response:
                    content = await response.text()
                    self.results['content_analysis'] = self._analyze_content(content)

            # Security indicators
            self.results['security_checks'] = self._security_checks()

            return self.results

        except Exception as e:
            return {
                'error': str(e),
                'url': self.url,
                'partial_results': self.results
            }

    def _analyze_url_structure(self):
        """Analyze URL structure and components."""
        return {
            'scheme': self.parsed.scheme,
            'domain': self.domain,
            'path': self.parsed.path,
            'query': self.parsed.query,
            'parameters': dict(param.split('=') for param in self.parsed.query.split('&')) if self.parsed.query else {},
            'top_level_domain': get_tld(self.url, fail_silently=True),
            'subdomain': self._get_subdomain(),
        }

    def _get_whois_info(self):
        """Get WHOIS information for the domain."""
        try:
            w = whois.whois(self.domain)
            return {
                'registrar': w.registrar,
                'creation_date': str(w.creation_date[0] if isinstance(w.creation_date, list) else w.creation_date),
                'expiration_date': str(w.expiration_date[0] if isinstance(w.expiration_date, list) else w.expiration_date),
                'last_updated': str(w.updated_date[0] if isinstance(w.updated_date, list) else w.updated_date),
                'status': w.status,
                'name_servers': w.name_servers,
                'age_days': self._calculate_domain_age(w.creation_date),
            }
        except Exception as e:
            return {'error': str(e)}

    def _check_ssl(self):
        """Check SSL certificate information."""
        try:
            context = ssl.create_default_context()
            with socket.create_connection((self.domain, 443)) as sock:
                with context.wrap_socket(sock, server_hostname=self.domain) as ssock:
                    cert = ssock.getpeercert()
                    return {
                        'issuer': dict(x[0] for x in cert['issuer']),
                        'subject': dict(x[0] for x in cert['subject']),
                        'version': cert['version'],
                        'valid_from': cert['notBefore'],
                        'valid_until': cert['notAfter'],
                        'has_ssl': True
                    }
        except Exception:
            return {'has_ssl': False}

    def _analyze_content(self, content):
        """Analyze webpage content for security indicators."""
        soup = BeautifulSoup(content, 'html.parser')
        return {
            'title': soup.title.string if soup.title else None,
            'meta_tags': {
                tag.get('name', tag.get('property')): tag.get('content')
                for tag in soup.find_all('meta') if tag.get('name') or tag.get('property')
            },
            'external_links': len([link for link in soup.find_all('a', href=True) 
                                 if not link['href'].startswith(self.url)]),
            'forms': len(soup.find_all('form')),
            'login_forms': len([form for form in soup.find_all('form') 
                              if any(input.get('type') == 'password' 
                                    for input in form.find_all('input'))]),
        }

    def _security_checks(self):
        """Perform various security checks on the URL."""
        return {
            'uses_https': self.parsed.scheme == 'https',
            'is_ip_address': bool(re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', self.domain)),
            'suspicious_words': self._check_suspicious_words(),
            'length_checks': {
                'total_length': len(self.url),
                'domain_length': len(self.domain),
                'path_length': len(self.parsed.path),
            }
        }

    def _get_subdomain(self):
        """Extract subdomain from URL."""
        try:
            return self.domain.split('.')[0] if len(self.domain.split('.')) > 2 else None
        except Exception:
            return None

    def _check_suspicious_words(self):
        """Check for suspicious words in the URL."""
        suspicious_words = [
            'login', 'signin', 'verify', 'secure', 'account', 'update', 'confirm',
            'paypal', 'banking', 'security', 'password', 'credential'
        ]
        found_words = [word for word in suspicious_words if word in self.url.lower()]
        return {
            'found': bool(found_words),
            'words': found_words
        }

    def _calculate_domain_age(self, creation_date):
        """Calculate domain age in days."""
        if not creation_date:
            return None
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        try:
            if isinstance(creation_date, str):
                creation_date = parse(creation_date)
            return (datetime.now() - creation_date).days
        except Exception:
            return None 