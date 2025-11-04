import { Page, expect } from '@playwright/test';
export async function continueIfOverlap(page: Page) {
  const dialog = page.getByRole('dialog', { name: '일정 겹침 경고' });
  if (await dialog.isVisible().catch(() => false)) {
    await dialog.getByRole('button', { name: '계속 진행' }).click();
    await expect(dialog).toBeHidden();
  }
}

/** 겹침 다이얼로그가 열려 있으면 '취소'를 눌러 닫습니다. */
export async function cancelIfOverlap(page: Page) {
  const dialog = page.getByRole('dialog', { name: '일정 겹침 경고' });
  if (await dialog.isVisible().catch(() => false)) {
    await dialog.getByRole('button', { name: '취소' }).click();
    await expect(dialog).toBeHidden();
  }
}

/** notistack 스낵바의 성공 메시지를 안정적으로 확인합니다. */
export async function expectAddedSnackbar(page: Page) {
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: /추가되었습니다|저장되었습니다|성공/ })
      .first()
  ).toBeVisible();
}
