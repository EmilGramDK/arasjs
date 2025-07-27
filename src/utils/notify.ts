/**
 *
 * @param message message to display
 * @param options options for the toast notification
 * @param options.type type of the notification (success, error, warning, info)
 * @param options.timeout duration in milliseconds before the notification disappears
 * @param options.position position of the notification on the screen (bottom-left, bottom-right, top-left, top-right)
 * @description Displays a toast notification with the specified message and options.
 * If no options are provided, it defaults to an info type notification that lasts 5 seconds and appears at the top-right of the screen.
 */
export function showToast(
  message: string,
  options: {
    type?: "success" | "error" | "warning" | "info";
    timeout?: number;
    position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  } = {},
): void {
  ArasModules.notify(message, {
    type: "info",
    timeout: 5000,
    position: "top-right",
    ...options,
  });
}

/**
 *
 * @param message message to display
 * @param type type of the alert (success, error, warning)
 * @description Displays an alert dialog with the specified message and type.
 */
export function showAlert(message: string, type: "success" | "error" | "warning" = "error"): void {
  ArasModules.Dialog.alert(message, { type });
}
