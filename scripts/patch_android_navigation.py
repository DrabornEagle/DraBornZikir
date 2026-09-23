from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
STYLES = ROOT / "android" / "app" / "src" / "main" / "res" / "values" / "styles.xml"
MAIN_ACTIVITY_CANDIDATES = [
    ROOT / "android" / "app" / "src" / "main" / "java" / "com" / "draborneagle" / "drabornzikir" / "MainActivity.kt",
    ROOT / "android" / "app" / "src" / "main" / "java" / "com" / "draborneagle" / "drabornzikir" / "MainActivity.java",
]


def patch_style_block(text: str) -> str:
    pattern = re.compile(r'(<style\s+name="AppTheme"[^>]*>)(.*?)(</style>)', re.S)
    match = pattern.search(text)
    if not match:
        raise SystemExit("AppTheme not found in styles.xml")

    body = match.group(2)
    for name in [
        "android:navigationBarColor",
        "android:windowLightNavigationBar",
        "android:windowDrawsSystemBarBackgrounds",
        "android:windowTranslucentNavigation",
    ]:
        body = re.sub(rf'\s*<item\s+name="{re.escape(name)}">.*?</item>', '', body, flags=re.S)

    forced = """
    <item name="android:navigationBarColor">@android:color/transparent</item>
    <item name="android:windowLightNavigationBar">false</item>
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    <item name="android:windowTranslucentNavigation">true</item>
"""
    replacement = match.group(1) + body.rstrip() + forced + "  " + match.group(3)
    return text[:match.start()] + replacement + text[match.end():]


def patch_main_activity(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    marker = "super.onCreate(null)"
    if marker not in text:
        marker = "super.onCreate(savedInstanceState)"
    if marker not in text:
        raise SystemExit(f"onCreate marker not found in {path}")

    if "DKD_TRANSPARENT_NAVIGATION" in text:
        return

    block = """
    // DKD_TRANSPARENT_NAVIGATION: keep Android system navigation controls over app content.
    window.navigationBarColor = android.graphics.Color.TRANSPARENT
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
      window.navigationBarDividerColor = android.graphics.Color.TRANSPARENT
    }
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
      window.isNavigationBarContrastEnforced = false
    }
"""
    text = text.replace(marker, marker + "\n" + block, 1)
    path.write_text(text, encoding="utf-8")


def main() -> None:
    if not STYLES.exists():
        raise SystemExit(f"Missing {STYLES}")
    text = STYLES.read_text(encoding="utf-8")
    STYLES.write_text(patch_style_block(text), encoding="utf-8")

    activity = next((candidate for candidate in MAIN_ACTIVITY_CANDIDATES if candidate.exists()), None)
    if activity is None:
        matches = list((ROOT / "android" / "app" / "src" / "main" / "java").glob("**/MainActivity.*"))
        if not matches:
            raise SystemExit("MainActivity not found")
        activity = matches[0]
    patch_main_activity(activity)

    print(f"Patched transparent navigation style: {STYLES}")
    print(f"Patched transparent navigation runtime: {activity}")


if __name__ == "__main__":
    main()
