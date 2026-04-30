import pytest
@pytest.mark.unit
def test_password_hash():
    from app.utils import hash_password

    pwd = "admin123"
    hashed = hash_password(pwd)

    assert hashed != pwd