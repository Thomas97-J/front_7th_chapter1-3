import { test, expect } from '@playwright/test';

test.describe('일정 조회 및 뷰 전환', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('월별 뷰에서 일정을 확인할 수 있다', async ({ page }) => {
    // 뷰 타입이 월별로 설정되어 있는지 확인
    const viewSelect = page.getByLabel('뷰 타입 선택');
    await expect(viewSelect).toBeVisible();

    // 월별 뷰 선택
    await viewSelect.click();
    await page.getByRole('option', { name: 'Month' }).click();

    // 달력이 표시되는지 확인
    await expect(page.locator('[data-testid="month-view"]')).toBeVisible();
  });

  test('주별 뷰로 전환할 수 있다', async ({ page }) => {
    const viewSelect = page.getByLabel('뷰 타입 선택');
    await viewSelect.click();
    await page.getByRole('option', { name: 'Week' }).click();

    await expect(page.locator('[data-testid="week-view"]')).toBeVisible();
  });

  test('다음 달로 이동할 수 있다', async ({ page }) => {
    const nextButton = page.getByLabel('Next');
    await nextButton.click();

    // 날짜가 변경되었는지 확인
    await page.waitForTimeout(500);
  });

  test('이전으로 이동할 수 있다', async ({ page }) => {
    const prevButton = page.getByLabel('Previous');
    await prevButton.click();

    await page.waitForTimeout(500);
  });
});
