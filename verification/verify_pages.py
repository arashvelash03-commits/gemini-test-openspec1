from playwright.sync_api import sync_playwright, expect

def verify_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Check Login Page
        print("Navigating to /login")
        page.goto("http://localhost:3000/login")

        # Verify title or header
        expect(page.get_by_role("heading", name="ورود به سامانه")).to_be_visible()
        expect(page.get_by_label("شماره همراه یا کد ملی")).to_be_visible()
        expect(page.get_by_label("کلمه عبور")).to_be_visible()

        page.screenshot(path="verification/login_page.png")
        print("Login Page verified")

        browser.close()

if __name__ == "__main__":
    try:
        verify_pages()
    except Exception as e:
        print(f"Verification failed: {e}")
        exit(1)
