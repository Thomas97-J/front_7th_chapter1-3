import { test, expect } from '@playwright/test';

import { continueIfOverlap } from './support/test-utils';

test.describe('일정 수정 및 삭제', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 테스트용 일정 생성
    await page.getByLabel('제목').fill('원본 일정');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByLabel('설명').fill('원본 설명');
    await page.getByLabel('위치').fill('회의실 A');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);

    await page.waitForTimeout(500);
  });

  test('단일 일정을 수정할 수 있다', async ({ page }) => {
    // 검색으로 일정 찾기
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('원본 일정');
    await page.waitForTimeout(300);

    // 수정 버튼 클릭
    await page.getByRole('button', { name: 'Edit event' }).first().click();
    // 제목 수정
    const titleInput = page.getByLabel('제목');
    await titleInput.clear();
    await titleInput.fill('수정된 일정');

    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  });

  test('단일 일정을 삭제할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('원본 일정');
    await page.waitForTimeout(300);

    // 삭제 버튼 클릭
    await page.getByRole('button', { name: 'Delete event' }).first().click();

    await continueIfOverlap(page);
    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
  });
});
