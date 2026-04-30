import pytest
@pytest.mark.smoke
def test_service_health(client):
    response = client.get("/")
    assert response.status_code in [200, 404]