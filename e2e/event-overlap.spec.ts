import { test, expect } from '@playwright/test';

import { continueIfOverlap } from './support/test-utils';

test.describe('일정 충돌 감지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 기존 일정 생성
    await page.getByLabel('제목').fill('기존 회의1');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByLabel('설명').fill('기존 일정');
    await page.getByLabel('위치').fill('회의실 A');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);
    await page.waitForTimeout(500);
  });

  test('겹치는 시간대에 일정 생성시 경고 다이얼로그를 표시한다', async ({ page }) => {
    await page.getByLabel('제목').fill('새 회의');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:30');
    await page.getByLabel('설명').fill('겹치는 일정');
    await page.getByLabel('위치').fill('회의실 B');

    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();
    const dialog = page.getByRole('dialog', { name: '일정 겹침 경고' });
    await expect(dialog).toBeVisible();

    // 충돌 경고 다이얼로그 확인
    await expect(page.getByText('일정 겹침 경고')).toBeVisible();
    await expect(dialog).toContainText('기존 회의1');
  });

  test('충돌 다이얼로그에서 계속 진행할 수 있다', async ({ page }) => {
    await page.getByLabel('제목').fill('새 회의');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:30');
    await page.getByLabel('설명').fill('겹치는 일정');
    await page.getByLabel('위치').fill('회의실 B');

    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();

    // 충돌 경고 다이얼로그에서 계속 진행
    await page.getByRole('button', { name: '계속 진행' }).click();

    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();
  });

  test('충돌 다이얼로그에서 취소할 수 있다', async ({ page }) => {
    await page.getByLabel('제목').fill('새 회의');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:30');

    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();

    // 충돌 경고 다이얼로그에서 취소
    await page.getByRole('button', { name: '취소' }).click();

    // 다이얼로그가 닫혔는지 확인
    await expect(page.getByText('일정 겹침 경고')).not.toBeVisible();
  });
});
