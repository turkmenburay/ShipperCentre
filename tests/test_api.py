import json
import os
import sys

# Add venv site-packages to sys.path if pytest runs without installed packages
venv_packages = os.path.join(os.path.dirname(__file__), '..', 'venv', 'lib', 'python3.12', 'site-packages')
if os.path.isdir(venv_packages) and venv_packages not in sys.path:
    sys.path.insert(0, os.path.abspath(venv_packages))

from app import app


def test_companies_endpoint():
    with app.test_client() as client:
        response = client.get('/api/companies')
        assert response.status_code == 200
        assert response.is_json
        assert isinstance(response.get_json(), list)


def test_countries_endpoint():
    with app.test_client() as client:
        response = client.get('/api/countries')
        assert response.status_code == 200
        assert response.is_json
        data = response.get_json()
        assert isinstance(data, dict)
        assert 'origins' in data and 'destinations' in data
