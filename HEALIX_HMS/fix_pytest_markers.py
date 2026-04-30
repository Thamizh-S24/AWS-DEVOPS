from pathlib import Path

BASE_DIR = Path("services")

MARKERS = {
    "unit": "unit",
    "smoke": "smoke",
    "integration": "integration",
    "regression": "regression",
}

def detect_marker(path: Path):
    path_str = str(path).lower()

    if "unit" in path_str:
        return "unit"
    elif "smoke" in path_str:
        return "smoke"
    elif "integration" in path_str:
        return "integration"
    elif "regression" in path_str:
        return "regression"
    return None


def add_marker(file_path: Path):
    marker = detect_marker(file_path)
    if not marker:
        return

    with open(file_path, "r") as f:
        content = f.read()

    # Skip if marker already exists
    if f"@pytest.mark.{marker}" in content:
        print(f"⚠️ Already marked: {file_path}")
        return

    lines = content.splitlines()

    # Ensure pytest import
    if "import pytest" not in content:
        lines.insert(0, "import pytest")

    new_lines = []
    for line in lines:
        stripped = line.strip()

        if stripped.startswith("def test_"):
            new_lines.append(f"@pytest.mark.{marker}")
        new_lines.append(line)

    with open(file_path, "w") as f:
        f.write("\n".join(new_lines))

    print(f"✅ Updated: {file_path}")


def process():
    if not BASE_DIR.exists():
        print("❌ services folder not found")
        return

    for service in BASE_DIR.iterdir():
        if not service.is_dir():
            continue

        tests_dir = service / "tests"
        if not tests_dir.exists():
            continue

        print(f"\n🚀 Processing {service.name}")

        for py_file in tests_dir.rglob("test_*.py"):
            add_marker(py_file)

    print("\n🎉 All test files updated!")


def create_pytest_ini():
    ini_path = Path("pytest.ini")

    content = """[pytest]
markers =
    unit: Unit tests
    smoke: Smoke tests
    integration: Integration tests
    regression: Regression tests
"""

    with open(ini_path, "w") as f:
        f.write(content)

    print("✅ Created pytest.ini")


if __name__ == "__main__":
    process()
    create_pytest_ini()
