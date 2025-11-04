import { test, expect } from '@playwright/test';

import { continueIfOverlap } from './support/test-utils';

test.describe('일정 생성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('단일 일정을 생성할 수 있다', async ({ page }) => {
    // 일정 추가 폼 입력
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-11-14');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByLabel('설명').fill('주간 팀 회의');
    await page.getByLabel('위치').fill('회의실 A');

    // 카테고리 선택
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 일정 저장
    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);
    // 성공 메시지 확인
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();
  });

  test('반복 일정을 생성할 수 있다 - 매일', async ({ page }) => {
    await page.getByLabel('제목').fill('일일 스탠드업');
    await page.getByLabel('날짜').fill('2025-11-13');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('09:30');
    await page.getByLabel('설명').fill('매일 아침 스탠드업');
    await page.getByLabel('위치').fill('온라인');

    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 반복 일정 설정
    await page.getByLabel('반복 일정').check();
    await page.getByTestId('repeat-type-select').click();
    await page.getByRole('listbox').getByRole('option', { name: 'daily-option' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-30');

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();
  });

  test('반복 일정을 생성할 수 있다 - 주간', async ({ page }) => {
    await page.getByLabel('제목').fill('주간 회의');
    await page.getByLabel('날짜').fill('2025-11-12');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');

    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByLabel('반복 일정').check();
    await page.getByTestId('repeat-type-select').click();
    await page.getByRole('listbox').getByRole('option', { name: 'weekly-option' }).click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-12-31');

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();
  });

  test('필수 입력값 누락시 에러 메시지를 표시한다', async ({ page }) => {
    // 제목만 입력하고 저장 시도
    await page.getByLabel('제목').fill('테스트 일정');
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByText('필수 정보를 모두 입력해주세요.')).toBeVisible();
  });

  test('시작 시간이 종료 시간보다 늦을 경우 에러를 표시한다', async ({ page }) => {
    await page.getByLabel('제목').fill('시간 오류 테스트');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('09:00');

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('시간 설정을 확인해주세요.')).toBeVisible();
  });

  test('알림 시간을 설정할 수 있다', async ({ page }) => {
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-10-19');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByLabel('설명').fill('주간 팀 회의');
    await page.getByLabel('위치').fill('회의실 A');

    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 알림 시간 설정 - 10분 전
    await page.getByTestId('notification-select').click();
    await page.getByTestId('notification-option-10').click();

    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);

    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();
  });
});
