import pytest
@pytest.mark.unit
def test_sample_logic():
    assert 1 + 1 == 2


@pytest.mark.unit
def test_string_check():
    username = "admin"
    assert username.upper() == "ADMIN"