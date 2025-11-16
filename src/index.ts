import { initArasEnv } from "./initialize";

initArasEnv();

/**
 * @description Initializes the Aras environment, injecting necessary styles and scripts.
 * @param callback Optional callback function to be executed after initialization.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
export const useArasJS = async (callback?: () => void): Promise<void> => {
  return waitForArasReady().then(callback);
};

/**
 * Waits for the Aras environment to be ready.
 * @returns {Promise<void>} A promise that resolves when the Aras environment is ready.
 */
export const waitForArasReady = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.arasReady) return resolve();
    window.addEventListener("aras:ready", () => resolve(), { once: true });
  });
};
