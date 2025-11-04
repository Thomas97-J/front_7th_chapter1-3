import { test, expect } from '@playwright/test';

test.describe('반복 일정 수정 및 삭제', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 반복 일정 생성
    await page.getByLabel('제목').fill('반복 회의');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByLabel('설명').fill('매일 회의');
    await page.getByLabel('위치').fill('회의실 A');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    
    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByRole('option', { name: '매일' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-30');
    
    await page.getByTestId('event-submit-button').click();
    await page.waitForTimeout(500);
  });

  test('반복 일정 수정시 다이얼로그가 표시된다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    await page.locator('[data-testid="event-list"]').getByRole('button', { name: '수정' }).first().click();

    // 반복 일정 수정 다이얼로그 확인
    await expect(page.getByText('반복 일정 수정')).toBeVisible();
    await expect(page.getByText('이 일정만 수정')).toBeVisible();
    await expect(page.getByText('모든 일정 수정')).toBeVisible();
  });

  test('반복 일정의 단일 인스턴스만 수정할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    await page.locator('[data-testid="event-list"]').getByRole('button', { name: '수정' }).first().click();

    // 이 일정만 수정 선택
    await page.getByText('이 일정만 수정').click();

    // 제목 변경
    const titleInput = page.getByLabel('제목');
    await titleInput.clear();
    await titleInput.fill('수정된 회의');

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  });

  test('반복 일정의 모든 인스턴스를 수정할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    await page.locator('[data-testid="event-list"]').getByRole('button', { name: '수정' }).first().click();

    // 모든 일정 수정 선택
    await page.getByText('모든 일정 수정').click();

    // 제목 변경
    const titleInput = page.getByLabel('제목');
    await titleInput.clear();
    await titleInput.fill('전체 수정된 회의');

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  });

  test('반복 일정 삭제시 다이얼로그가 표시된다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    await page.locator('[data-testid="event-list"]').getByRole('button', { name: '삭제' }).first().click();

    await expect(page.getByText('반복 일정 삭제')).toBeVisible();
    await expect(page.getByText('이 일정만 삭제')).toBeVisible();
    await expect(page.getByText('모든 일정 삭제')).toBeVisible();
  });

  test('반복 일정의 단일 인스턴스만 삭제할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    await page.locator('[data-testid="event-list"]').getByRole('button', { name: '삭제' }).first().click();

    // 이 일정만 삭제 선택
    await page.getByText('이 일정만 삭제').click();

    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
  });

  test('반복 일정의 모든 인스턴스를 삭제할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    await page.locator('[data-testid="event-list"]').getByRole('button', { name: '삭제' }).first().click();

    // 모든 일정 삭제 선택
    await page.getByText('모든 일정 삭제').click();

    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
  });
});
