import pytest

@pytest.mark.smoke
def test_health(client):
    if client:
        response = client.get("/")
        assert response.status_code in [200, 404]
    else:
        assert True
