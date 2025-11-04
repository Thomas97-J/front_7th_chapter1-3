import { test, expect } from '@playwright/test';

import { continueIfOverlap } from './support/test-utils';

test.describe('일정 검색', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 테스트용 일정 2개 생성
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);
    await page.waitForTimeout(500);

    await page.getByLabel('제목').fill('개인 약속');
    await page.getByLabel('날짜').fill('2025-11-16');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('15:00');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();
    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);
    await page.waitForTimeout(500);
  });

  test('제목으로 일정을 검색할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('팀 회의');
    await page.waitForTimeout(300);

    // 검색 결과에 "팀 회의"가 포함되어 있는지 확인
    const eventList = page.locator('[data-testid="event-list"]');
    await continueIfOverlap(page);

    await expect(eventList.getByText('팀 회의')).toBeVisible();
  });

  test('검색어를 지우면 모든 일정이 표시된다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('팀 회의');
    await page.waitForTimeout(300);

    await searchInput.clear();
    await page.waitForTimeout(300);

    // 모든 일정이 표시되는지 확인
    const eventList = page.locator('[data-testid="event-list"]');
    await expect(eventList.getByText('팀 회의')).toBeVisible();
    await expect(eventList.getByText('개인 약속')).toBeVisible();
  });

  test('검색 결과가 없을 때 메시지를 표시한다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('존재하지않는일정');
    await page.waitForTimeout(300);

    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();
  });
});
