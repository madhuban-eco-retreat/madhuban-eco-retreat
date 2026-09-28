import {
    SAFARI_RATE,
    SAFARI_WITH_NATURALIST_RATE,
    GUIDED_HIKE_RATE_PER_PERSON,
    GUIDED_HIKE_MIN_GUESTS,
    BUSH_DINING_RATE_PER_COUPLE,
} from "@/lib/pricing/config.mjs";
export const BOOKING_ADDONS = [
    { id: 'forest-walk', label: 'Forest Walk Experience', price: 850, unit: 'per person' },
    { id: 'village-visit', label: 'Village Visit', price: 1200, unit: 'per group (up to 6)' },
    { id: 'bird-watching', label: 'Bird Watching Walk', price: 600, unit: 'per person' },
    { id: 'bhojpur-temple', label: 'Bhojpur Temple Tour', price: 2500, unit: 'per vehicle' },
    { id: 'bush-dining', label: 'Bush Dining', price: BUSH_DINING_RATE_PER_COUPLE, unit: 'per couple, setup fee' },
    { id: 'alfresco-dining', label: 'Alfresco Forest Dining', price: 5500, unit: 'per couple, setup fee' },
    { id: 'early-checkin', label: 'Early Check-in (before 12 PM)', price: 2000, unit: 'flat' },
    { id: 'late-checkout', label: 'Late Check-out (after 11 AM)', price: 2000, unit: 'flat' },
    { id: 'extra-mattress', label: 'Extra Mattress', price: 1500, unit: 'per night' },
    // From the 2026-27 tariff sheet's optional paid experiences. Appended at the
    // end because the admin form keys its saved draft by position in this list.
    { id: 'ratapani-safari', label: 'Ratapani Safari', price: SAFARI_RATE, unit: 'per safari' },
    { id: 'ratapani-safari-naturalist', label: 'Ratapani Safari with Naturalist', price: SAFARI_WITH_NATURALIST_RATE, unit: 'per safari' },
    { id: 'guided-hike', label: `Guided Hiking / Saru Maru Trek (min ${GUIDED_HIKE_MIN_GUESTS} guests)`, price: GUIDED_HIKE_RATE_PER_PERSON, unit: 'per person' },
];
export function getAddonById(id) {
    return BOOKING_ADDONS.find((a) => a.id === id);
}
