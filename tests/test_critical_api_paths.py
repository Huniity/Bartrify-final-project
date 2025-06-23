import pytest
import requests
import os
import random
import string

BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:8000/api/')

def generate_random_string(length=8):
    """Generate a random alphanumeric string."""
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(length))

# ----------------------
# Pytest Fixtures
# ----------------------

@pytest.fixture(scope="module")
def api_base_url():
    """Fixture for base API URL."""
    return BASE_URL

@pytest.fixture(scope="module")
def new_user_data():
    """Generate unique user data for registration tests."""
    username = f"testuser_{generate_random_string()}"
    return {
        "username": username,
        "email": f"{username}@example.com",
        "password": "StrongTestPassword123!",
        "password2": "StrongTestPassword123!",
        "first_name": f"First_{generate_random_string(3)}",
        "last_name": f"Last_{generate_random_string(3)}",
        "location": "Lisbon, Portugal"
    }

@pytest.fixture(scope="module")
def registered_user_token(api_base_url, new_user_data):
    """Register and log in a user, yielding an access token."""
    register_url = f"{api_base_url}register/"
    login_url = f"{api_base_url}auth/login/"

    response = requests.post(register_url, json=new_user_data)
    assert response.status_code in [200, 201], f"Registration failed: {response.text}"

    login_payload = {
        "username": new_user_data["username"],
        "password": new_user_data["password"]
    }

    login_response = requests.post(login_url, json=login_payload)
    try:
        login_data = login_response.json()
    except requests.exceptions.JSONDecodeError:
        pytest.fail(f"Login response not JSON: {login_response.text}")

    assert login_response.status_code == 200, "Login failed after registration"
    assert "access" in login_data and "refresh" in login_data

    yield login_data["access"]

# ----------------------
# Core Functional Tests
# ----------------------

def test_user_registration(api_base_url):
    """Validate user registration returns expected fields and status."""
    data = {
        "username": f"register_test_{generate_random_string()}",
        "email": f"test_{generate_random_string()}@example.com",
        "password": "AnotherStrongPassword!",
        "password2": "AnotherStrongPassword!",
        "first_name": f"First_{generate_random_string(3)}",
        "last_name": f"Last_{generate_random_string(3)}",
        "location": "Porto, Portugal"
    }

    response = requests.post(f"{api_base_url}register/", json=data)
    assert response.status_code == 201

    json_data = response.json()
    assert json_data["username"] == data["username"]
    assert json_data["email"] == data["email"]
    assert json_data["first_name"] == data["first_name"]
    assert json_data["last_name"] == data["last_name"]
    assert json_data["location"] == data["location"]

def test_user_login(api_base_url, new_user_data, registered_user_token):
    """Ensure login endpoint returns valid access and refresh tokens."""
    response = requests.post(
        f"{api_base_url}auth/login/",
        json={"username": new_user_data["username"], "password": new_user_data["password"]}
    )

    assert response.status_code == 200
    tokens = response.json()
    assert isinstance(tokens.get("access"), str) and tokens["access"]
    assert isinstance(tokens.get("refresh"), str) and tokens["refresh"]

def test_fetch_dashboard_data(api_base_url, registered_user_token):
    """Check that dashboard endpoint returns expected structure for authenticated users."""
    response = requests.get(
        f"{api_base_url}dashboard/",
        headers={"Authorization": f"Bearer {registered_user_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_fetch_my_profile(api_base_url, registered_user_token, new_user_data):
    """Validate profile endpoint returns correct user data."""
    response = requests.get(
        f"{api_base_url}me/",
        headers={"Authorization": f"Bearer {registered_user_token}"}
    )

    assert response.status_code == 200
    profile = response.json()

    assert profile["username"] == new_user_data["username"]
    assert profile["email"] == new_user_data["email"]
    assert profile["first_name"] == new_user_data["first_name"]
    assert profile["last_name"] == new_user_data["last_name"]
    assert profile["location"] == new_user_data["location"]
    assert "bio" in profile and "avatar" in profile

def test_update_my_profile(api_base_url, registered_user_token):
    """Test profile update and verify persistence of changes."""
    updated_data = {
        "first_name": f"Updated_{generate_random_string(4)}",
        "bio": f"My updated bio about {generate_random_string(5)} services.",
        "location": "Lisbon, Portugal"
    }

    response = requests.patch(
        f"{api_base_url}me/",
        headers={"Authorization": f"Bearer {registered_user_token}"},
        json=updated_data
    )
    assert response.status_code in [200, 204]

    verify_response = requests.get(
        f"{api_base_url}me/",
        headers={"Authorization": f"Bearer {registered_user_token}"}
    )
    profile = verify_response.json()

    assert profile["first_name"] == updated_data["first_name"]
    assert profile["bio"] == updated_data["bio"]
    assert profile["location"] == updated_data["location"]

def test_create_service(api_base_url, registered_user_token):
    """Create services (token-based and barter-based) and validate responses."""
    headers = {"Authorization": f"Bearer {registered_user_token}"}

    token_payload = {
        "title": f"Dev Help {generate_random_string(5)}",
        "description": "Help with web dev tasks.",
        "payment_type": "token",
        "category": "WEB_DEV",
        "price": 10
    }

    response = requests.post(f"{api_base_url}services/", headers=headers, json=token_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == token_payload["title"]
    assert data["payment_type"] == "token"

    barter_payload = {
        "title": f"Barter Design {generate_random_string(5)}",
        "description": "Design in exchange for home repair.",
        "payment_type": "barter",
        "category": "GRAPHIC_DESIGN",
        "desired_category": "HOME_REPAIR"
    }

    barter_response = requests.post(f"{api_base_url}services/", headers=headers, json=barter_payload)
    assert barter_response.status_code == 201
    barter_data = barter_response.json()
    assert barter_data["title"] == barter_payload["title"]
    assert barter_data["payment_type"] == "barter"

def test_fetch_my_services(api_base_url, registered_user_token):
    """Check user can list their created services."""
    response = requests.get(
        f"{api_base_url}my-services/",
        headers={"Authorization": f"Bearer {registered_user_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_fetch_service_requests(api_base_url, registered_user_token):
    """Ensure user can retrieve their service requests."""
    response = requests.get(
        f"{api_base_url}requests/",
        headers={"Authorization": f"Bearer {registered_user_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)

# ----------------------
# Negative Test Cases
# ----------------------

def test_unauthorized_access_dashboard(api_base_url):
    """Attempt to access a protected endpoint without a token should fail."""
    response = requests.get(f"{api_base_url}dashboard/")
    assert response.status_code == 401
    assert response.json().get("detail") == "Authentication credentials were not provided."

def test_invalid_login_credentials(api_base_url):
    """Login attempt with invalid credentials should fail with 401."""
    payload = {
        "username": "nonexistent_user",
        "password": "invalid"
    }

    response = requests.post(f"{api_base_url}auth/login/", json=payload)
    assert response.status_code == 401
    assert response.json().get("detail") == "No active account found with the given credentials"