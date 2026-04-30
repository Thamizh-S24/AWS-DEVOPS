import pytest
@pytest.mark.integration
def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code in [200, 404]


@pytest.mark.integration
def test_invalid_endpoint(client):
    response = client.post("/invalid-endpoint", json={})
    assert response.status_code in [400, 404, 422]