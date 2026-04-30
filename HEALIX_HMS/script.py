from pathlib import Path

BASE_DIR = Path("services")

CONFTEST_CONTENT = """import pytest
from fastapi.testclient import TestClient
import sys
import os
import importlib

# Add service root to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

app = None

# Try multiple possible app locations
POSSIBLE_PATHS = [
    "app.main",
    "main",
    "src.main",
]

for path in POSSIBLE_PATHS:
    try:
        module = importlib.import_module(path)
        app = getattr(module, "app", None)
        if app:
            print(f"Loaded app from {path}")
            break
    except Exception:
        continue


@pytest.fixture(scope="module")
def client():
    if app:
        return TestClient(app)
    return None
"""


def fix_conftest(service_path: Path):
    tests_dir = service_path / "tests"
    tests_dir.mkdir(exist_ok=True)

    conftest_file = tests_dir / "conftest.py"

    conftest_file.write_text(CONFTEST_CONTENT)
    print(f"✅ Fixed: {conftest_file}")


def main():
    if not BASE_DIR.exists():
        print("❌ services folder not found")
        return

    for service in BASE_DIR.iterdir():
        if service.is_dir():
            print(f"🔧 Processing {service.name}")
            fix_conftest(service)

    print("\n🎉 All conftest files fixed!")


if __name__ == "__main__":
    main()
