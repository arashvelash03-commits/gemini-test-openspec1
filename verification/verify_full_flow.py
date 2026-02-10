from playwright.sync_api import sync_playwright
import time
import pyotp

BASE_URL = "http://localhost:3000"

def verify_full_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # Test 1: Admin Login -> Redirect to /admin/users
        print("Testing Admin Login...")
        context = browser.new_context()
        page = context.new_page()
        page.goto(f"{BASE_URL}/login")
        page.fill("input[name='identifier']", "0000000000")
        page.fill("input[name='password']", "password123")
        page.click("button[type='submit']")
        # Expect redirect to admin
        try:
            page.wait_for_url("**/admin/users", timeout=20000)
            print("PASS: Admin redirected to /admin/users")
            page.screenshot(path="verification/admin_dashboard.png")
        except Exception as e:
            print(f"FAIL: Admin Login. Current URL: {page.url}")
            page.screenshot(path="verification/admin_fail.png")
            raise e
        context.close()

        # Test 2: Doctor No 2FA -> Redirect to /setup-2fa
        print("Testing Doctor No 2FA Login...")
        context = browser.new_context()
        page = context.new_page()
        page.goto(f"{BASE_URL}/login")
        page.fill("input[name='identifier']", "1111111111")
        page.fill("input[name='password']", "password123")

        # Dispatch click event instead of normal click to bypass overlay
        page.eval_on_selector("button[type='submit']", "el => el.click()")

        # Expect redirect to setup-2fa
        try:
            page.wait_for_url("**/setup-2fa", timeout=20000)
            print("PASS: Doctor No 2FA redirected to /setup-2fa")
            page.screenshot(path="verification/setup_2fa.png")
        except Exception as e:
            print(f"FAIL: Doctor No 2FA. Current URL: {page.url}")
            page.screenshot(path="verification/doctor_no2fa_fail.png")
            raise e

        # Test 2b: Verify Logout Button exists
        print("Testing Logout Button on Setup 2FA...")
        if page.is_visible("button:has-text('خروج')"):
            print("PASS: Logout button visible")
        else:
             print("FAIL: Logout button not visible")

        context.close()

        # Test 3: Doctor With 2FA -> TOTP Challenge -> Redirect to /dashboard
        print("Testing Doctor With 2FA Login...")
        context = browser.new_context()
        page = context.new_page()
        page.goto(f"{BASE_URL}/login")
        page.fill("input[name='identifier']", "2222222222")
        page.fill("input[name='password']", "password123")

        page.eval_on_selector("button[type='submit']", "el => el.click()")

        # Expect TOTP field to appear (Client side state change)
        try:
            page.wait_for_selector("input[name='totpCode']", timeout=5000)
            print("PASS: TOTP Field Appeared")
        except Exception as e:
            print(f"FAIL: TOTP Field did not appear. Current URL: {page.url}")
            # Try to read error message
            try:
                error_msg = page.text_content("#error-message")
                print(f"Error Message on Page: {error_msg}")
            except:
                print("No error message element found.")

            page.screenshot(path="verification/totp_fail.png")
            raise e

        # Generate TOTP
        totp = pyotp.TOTP("KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD")
        code = totp.now()
        print(f"Entering TOTP: {code}")
        page.fill("input[name='totpCode']", code)

        page.eval_on_selector("button[type='submit']", "el => el.click()")

        try:
            page.wait_for_url("**/dashboard", timeout=20000)
            print("PASS: Doctor With 2FA redirected to /dashboard")
            page.screenshot(path="verification/dashboard.png")
        except Exception as e:
            print(f"FAIL: Doctor With 2FA Login. Current URL: {page.url}")
            page.screenshot(path="verification/doctor_2fa_fail.png")
            raise e

        # Check Profile Access
        print("Testing Profile Access...")
        page.goto(f"{BASE_URL}/profile")
        if "/login" in page.url:
             print("FAIL: Profile redirected to login")
        else:
             print("PASS: Doctor Can Access Profile")
             page.screenshot(path="verification/doctor_profile.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    verify_full_flow()
