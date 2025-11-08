import { test, expect } from '@playwright/test';

import { continueIfOverlap } from './support/test-utils';

test.describe('일정 검색', () => {
  // 각 테스트마다 고유한 ID 생성
  const uniqueId = () => Math.random().toString(36).substring(2, 9);

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const testId = uniqueId();

    // 테스트용 일정 2개 생성
    await page.getByLabel('제목').fill(`팀 회의_${testId}`);
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);
    await page.waitForTimeout(500);

    await page.getByLabel('제목').fill(`개인 약속_${testId}`);
    await page.getByLabel('날짜').fill('2025-11-16');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('15:00');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();
    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);
    await page.waitForTimeout(500);

    // testId를 테스트에서 사용할 수 있도록 저장
    // @ts-expect-error - adding custom property
    page.testId = testId;
  });

  test('제목으로 일정을 검색할 수 있다', async ({ page }) => {
    // @ts-expect-error - custom property
    const testId = page.testId;

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill(`팀 회의_${testId}`);
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');
    await expect(eventList.getByText(`팀 회의_${testId}`)).toBeVisible();
  });

  test('검색어를 지우면 모든 일정이 표시된다', async ({ page }) => {
    // @ts-expect-error - custom property
    const testId = page.testId;

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill(`팀 회의_${testId}`);
    await page.waitForTimeout(300);

    await searchInput.clear();
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');
    await expect(eventList.getByText(`팀 회의_${testId}`)).toBeVisible();
    await expect(eventList.getByText(`개인 약속_${testId}`)).toBeVisible();
  });

  test('검색 결과가 없을 때 메시지를 표시한다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('존재하지않는일정');
    await page.waitForTimeout(300);

    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();
  });
});
