// Shared between the block form and the API route so the two cannot drift on
// what "Custom" means. No server-only marker — the client imports this.

/**
 * Sentinel value for the dropdown's free-text option.
 *
 * It is never stored: the route swaps it for the text the admin typed, so a
 * block row's `reason` is always something readable on the calendar.
 */
export const CUSTOM_BLOCK_REASON = "__custom__";

export const BLOCK_REASON_OPTIONS = [
    { value: "Maintenance", label: "Maintenance" },
    { value: "Deep Cleaning", label: "Deep Cleaning" },
    { value: "Owner Use", label: "Owner Use" },
    { value: "Staff Accommodation", label: "Staff Accommodation" },
    { value: "Photography/Shoot", label: "Photography/Shoot" },
    { value: "Complementary Stay", label: "Complementary Stay" },
    { value: CUSTOM_BLOCK_REASON, label: "Custom…" },
];
