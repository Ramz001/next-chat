import { test, expect } from '@playwright/test'
import { ADMIN_USER } from '../consts/auth-tokens'
import { getWhiteboxSessionToken } from '../utils/whitebox-auth'

test.describe('Chat page - unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('should show sign-in prompt instead of chat', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /Sign in to start chatting/ })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /Sign in to start chatting/ }).locator('..').getByRole('link', { name: /Sign In/ })
    ).toBeVisible()
  })

  test('should not show the chat input', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByPlaceholder(/What would you like to know/)
    ).not.toBeVisible()
  })

  test('should redirect to sign-in page when clicking sign in', async ({
    page,
  }) => {
    await page.goto('/')

    await page
      .getByRole('heading', { name: /Sign in to start chatting/ })
      .locator('..')
      .getByRole('link', { name: /Sign In/ })
      .click()

    await expect(page).toHaveURL(/\/auth\/sign-in/)
  })
})

test.describe('Chat page - authenticated user', () => {
  test('should display the chat interface', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByPlaceholder(/What would you like to know/)
    ).toBeVisible()
  })

  test('should show empty conversation state', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('No messages yet')).toBeVisible()
    await expect(
      page.getByText('Start a conversation to see messages here')
    ).toBeVisible()
  })

  test('should display suggestion buttons', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByText('What are the latest trends in AI?')
    ).toBeVisible()
    await expect(
      page.getByText('How does machine learning work?')
    ).toBeVisible()
  })

  test('should display model selector with default model', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.getByText('Gemini 3 Flash')).toBeVisible()
  })

  test('should open model selector and show available models', async ({
    page,
  }) => {
    await page.goto('/')

    await page.getByText('Gemini 3 Flash').click()

    await expect(page.getByPlaceholder('Search models...')).toBeVisible()
    await expect(page.getByText('GPT-5 Mini').first()).toBeVisible()
    await expect(page.getByText('Kimi K2').first()).toBeVisible()
  })

  test('should allow switching models', async ({ page }) => {
    await page.goto('/')

    await page.getByText('Gemini 3 Flash').click()
    await page.getByText('GPT-5 Mini').first().click()

    await expect(page.getByText('GPT-5 Mini').first()).toBeVisible()
  })

  test('should allow typing a message in the textarea', async ({ page }) => {
    await page.goto('/')

    const textarea = page.getByPlaceholder(/What would you like to know/)
    await textarea.fill('Hello, how are you?')

    await expect(textarea).toHaveValue('Hello, how are you?')
  })

  test('should have the search toggle button', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('button', { name: /Search/ })
    ).toBeVisible()
  })

  test('should have the submit button disabled when textarea is empty', async ({
    page,
  }) => {
    await page.goto('/')

    const submitButton = page.getByRole('button', { name: /send/i }).or(
      page.locator('button[type="submit"]')
    )
    await expect(submitButton).toBeDisabled()
  })

  test('should enable submit button when text is entered', async ({
    page,
  }) => {
    await page.goto('/')

    const textarea = page.getByPlaceholder(/What would you like to know/)
    await textarea.fill('Test message')

    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeEnabled()
  })
})

test.describe('Chat page - admin user', () => {
  test('should also have access to the chat interface', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'authjs.session-token',
        value: await getWhiteboxSessionToken(ADMIN_USER),
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: Math.round((Date.now() + 86400000) / 1000),
      },
    ])

    await page.goto('/')

    await expect(
      page.getByPlaceholder(/What would you like to know/)
    ).toBeVisible()

    await expect(page.getByText('No messages yet')).toBeVisible()
  })
})
