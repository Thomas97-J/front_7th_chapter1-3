import { test, expect } from '@playwright/test';
import { continueIfOverlap, uniqueId } from './support/test-utils';

test.describe('반복 일정 수정 및 삭제', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const testId = uniqueId();

    // 고유한 반복 일정 생성
    await page.getByLabel('제목').fill(`반복 회의_${testId}`);
    await page.getByLabel('날짜').fill('2025-11-16');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');
    await page.getByLabel('설명').fill('삭제 테스트용 매일 회의');
    await page.getByLabel('위치').fill('회의실 B');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    // 반복 일정 체크
    await page.getByLabel('반복 일정').check();

    // 반복 유형 선택
    const repeatTypeLabel = page.locator('label:has-text("반복 유형")');
    const repeatTypeControl = repeatTypeLabel.locator('..').locator('..');
    await repeatTypeControl.locator('div[role="combobox"]').click();
    await page.locator('li[role="option"]').filter({ hasText: '매일' }).click();

    // 반복 간격 입력
    const repeatIntervalInput = page
      .locator('label:has-text("반복 간격")')
      .locator('..')
      .locator('input');
    await repeatIntervalInput.fill('1');

    // 반복 종료일 입력
    const repeatEndDateInput = page
      .locator('label:has-text("반복 종료일")')
      .locator('..')
      .locator('input');
    await repeatEndDateInput.fill('2025-11-25');

    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);

    await page.waitForTimeout(500);
    // @ts-expect-error - adding custom property
    page.testId = testId;
  });

  test('반복 일정 수정시 다이얼로그가 표시된다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    // aria-label로 수정 버튼 찾기
    const eventList = page.locator('[data-testid="event-list"]');
    await eventList.getByRole('button', { name: 'Edit event' }).first().click();

    // 반복 일정 수정 다이얼로그 확인
    await expect(page.getByRole('heading', { name: '반복 일정 수정' })).toBeVisible();
    await expect(page.getByRole('button', { name: '아니오' })).toBeVisible();
    await expect(page.getByRole('button', { name: '예' })).toBeVisible();
  });

  test('반복 일정의 단일 인스턴스만 수정할 수 있다', async ({ page }) => {
    // @ts-expect-error - custom property
    const testId = page.testId;

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill(`반복 회의_${testId}`);
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');
    await eventList.getByRole('button', { name: 'Edit event' }).first().click();

    // 이 일정만 수정 선택
    await page.getByRole('button', { name: '예' }).click();

    // 제목 변경
    const titleInput = page.getByLabel('제목');
    await titleInput.clear();
    await titleInput.fill(`수정된 회의_${testId}`);

    await page.getByTestId('event-submit-button').click();
    await continueIfOverlap(page);

    await page.waitForTimeout(500);

    // 검색하여 수정된 일정 확인
    await searchInput.clear();
    await searchInput.fill(`수정된 회의_${testId}`);
    await page.waitForTimeout(300);

    await expect(
      page.locator('[data-testid="event-list"]').getByText(`수정된 회의_${testId}`)
    ).toBeVisible();
  });

  test('반복 일정의 모든 인스턴스를 수정할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');
    await eventList.getByRole('button', { name: 'Edit event' }).first().click();

    // 모든 일정 수정 선택
    await page.getByRole('button', { name: '아니오' }).click();

    // 제목 변경
    const titleInput = page.getByLabel('제목');
    await titleInput.clear();
    await titleInput.fill('전체 수정된 회의');

    await page.getByTestId('event-submit-button').click();

    await continueIfOverlap(page);

    await page.waitForTimeout(500);

    // 검색하여 수정된 일정 확인
    await searchInput.clear();
    await searchInput.fill('전체 수정된 회의');
    await page.waitForTimeout(300);

    const eventCount = await page
      .locator('[data-testid="event-list"]')
      .getByText('전체 수정된 회의')
      .count();
    expect(eventCount).toBeGreaterThan(0);
  });

  test('반복 일정 삭제시 다이얼로그가 표시된다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    // aria-label로 삭제 버튼 찾기
    const eventList = page.locator('[data-testid="event-list"]');
    await eventList.getByRole('button', { name: 'Delete event' }).first().click();

    // 반복 일정 삭제 다이얼로그 확인
    await expect(page.getByRole('heading', { name: '반복 일정 삭제' })).toBeVisible();
    await expect(page.getByRole('button', { name: '예' })).toBeVisible();
    await expect(page.getByRole('button', { name: '아니오' })).toBeVisible();
  });

  test('반복 일정의 단일 인스턴스만 삭제할 수 있다', async ({ page }) => {
    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');
    const initialCount = await eventList.getByText('반복 회의').count();

    await eventList.getByRole('button', { name: 'Delete event' }).first().click();

    // 이 일정만 삭제 선택
    await page.getByRole('button', { name: '예' }).click();
    await page.waitForTimeout(500);

    // 검색하여 일정 확인
    await searchInput.clear();
    await searchInput.fill('반복 회의');
    await page.waitForTimeout(300);

    const afterCount = await eventList.getByText('반복 회의').count();
    expect(afterCount).toBeLessThan(initialCount);
  });

  test('반복 일정의 모든 인스턴스를 삭제할 수 있다', async ({ page }) => {
    // @ts-expect-error - custom property
    const testId = page.testId;

    const searchInput = page.getByPlaceholder('검색어를 입력하세요');
    await searchInput.fill(`반복 회의_${testId}`);
    await page.waitForTimeout(300);

    const eventList = page.locator('[data-testid="event-list"]');
    await eventList.getByRole('button', { name: 'Delete event' }).first().click();

    // 모든 일정 삭제 선택
    await page.getByRole('button', { name: '아니오' }).click();
    await page.waitForTimeout(500);

    // 검색하여 일정이 없는지 확인
    await searchInput.clear();
    await searchInput.fill(`반복 회의_${testId}`);
    await page.waitForTimeout(300);

    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();
  });
});
