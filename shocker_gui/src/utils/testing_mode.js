// Testing mode state management
let testingMode = false;

/**
 * Get the current testing mode state
 * @returns {boolean} True if testing mode is enabled, false otherwise
 */
export function getTestingMode() {
    return testingMode;
}

/**
 * Set the testing mode state
 * @param {boolean} enabled - Whether testing mode should be enabled
 */
export function setTestingMode(enabled) {
    testingMode = enabled;
}

