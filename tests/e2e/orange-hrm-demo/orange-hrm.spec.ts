import { test, expect, Page } from "@playwright/test";
import { describe } from "node:test";

const baseURL = "https://opensource-demo.orangehrmlive.com";
const username = "Admin";
const password = "admin123";

async function getLocator(page: Page) {
    return{
        pageTitle: page.getByRole("heading", { name: "Login" }),
        loginBranding: page.locator('.orangehrm-login-branding'),
        logo: page.getByRole("img", { name: "orangehrm-logo" }),
        usernameField: page.getByPlaceholder("Username"),
        passwordField: page.getByPlaceholder("Password"),
        loginButton: page.getByRole("button", { name: "Login" }),
        adminPanel: page.getByLabel("Sidepanel").locator("div").filter({ hasText: "AdminPIMLeaveTimeRecruitmentMy" }),
        dashboard: page.getByRole("heading", { name: "Dashboard" }),
        errorMessage: page.getByRole('alert').locator('div').filter({ hasText: 'Invalid credentials' })
    };
}

test.beforeEach("Open the page", async ({ page }) => {
    const locator = await getLocator(page);

    await page.goto(baseURL);
    await expect(page).toHaveURL(`${baseURL}/web/index.php/auth/login`);
    await expect(locator.pageTitle).toHaveText("Login");
    await expect(locator.loginBranding).toBeVisible();
    await expect(locator.logo).toBeVisible();
    await expect(locator.usernameField).toBeVisible();
    await expect(locator.passwordField).toBeVisible();
});

test.afterEach("Close page", async ({ page }) => {
  page.close();
});

describe("Login functionality", () => {
  test("Check successful login with valid credentials", async ({ page }) => {
    const locator = await getLocator(page);
    
    await locator.usernameField.fill(username);
    await locator.passwordField.fill(password);
    await locator.loginButton.click();
    await expect(locator.dashboard).toHaveText("Dashboard");
    await expect(locator.adminPanel).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeEnabled();
  });

  test("Check unsuccessful login with invalid username", async ({ page }) => {
    const locator = await getLocator(page);
    const invalidUsername = "ionel";

    await locator.usernameField.fill(invalidUsername);
    await locator.passwordField.fill(password);
    await locator.loginButton.click();
    await expect(locator.pageTitle).toHaveText("Login");
    await expect(locator.loginBranding).toBeVisible();
    await expect(locator.errorMessage).toBeVisible();
  });

  test("Check unsuccessful login with invalid password", async ({ page }) => {
    const locator = await getLocator(page);
    const invalidPassword = "ionel";

    await locator.usernameField.fill(username);
    await locator.passwordField.fill(invalidPassword);
    await locator.loginButton.click();
    await expect(locator.pageTitle).toHaveText("Login");
    await expect(locator.loginBranding).toBeVisible();
    await expect(locator.errorMessage).toBeVisible();
  });
});