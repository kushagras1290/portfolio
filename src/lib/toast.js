export const TOAST_EVENT = 'app:toast';

export function showToast(message, duration = 2600) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, duration } }));
}
