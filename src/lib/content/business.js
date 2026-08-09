/**
 * Single source of truth for all NAP (Name, Address, Phone) data and brand constants.
 * Import this — never hardcode address fragments anywhere else.
 *
 * GSTIN belongs to the parent entity (Somaiya Group), not this property.
 * Add it to invoice templates via Somaiya's entity details, not here.
 */
export const BUSINESS = {
    name: 'Madhuban Eco Retreat',
    legalName: 'Madhuban Eco Retreat (A Somaiya Group Initiative)',
    parent: 'Somaiya Group',
    url: 'https://www.madhubanecoretreat.com',
    phone: '+919770558419',
    email: 'madhubanresort@somaiya.com',
    whatsapp: '+919770558419',
    address: {
        streetAddress: 'Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road',
        locality: 'Rehti',
        district: 'Sehore',
        region: 'Madhya Pradesh',
        postalCode: '466446',
        country: 'IN',
        /** Full single-line address for display use. */
        full: 'Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road, Rehti, Sehore, Madhya Pradesh — 466446',
    },
    geo: {
        latitude: 22.88,
        longitude: 77.52,
    },
    /** schema.org sameAs — verified social profiles. CLAUDE.md §7.3 lists 10; 9 are documented. */
    sameAs: [
        'https://www.facebook.com/madhubanecoretreat/',
        'https://www.instagram.com/madhubanecoretreat/',
        'https://www.linkedin.com/company/madhuban-eco-retreat-ratapani-sanctuary/',
        'https://www.youtube.com/@madhuban-eco-retreat',
        'https://x.com/madhubanretreat',
        'https://www.pinterest.com/madhubanecoretreat/',
        'https://www.tumblr.com/madhuban-eco-retreat',
        'https://www.reddit.com/user/Naive-Transition-394/',
        'https://www.quora.com/profile/Madhuban-Eco-Retreat',
    ],
    /**
     * Cancellation policy — surfaced in UI copy, terms, review step, and FAQ schema.
     *
     * These tiers previously described a seven-day free-cancellation window that
     * the property has never operated: the terms page, the review step and the
     * confirmation email all quote the 45/15-day schedule below. Keeping the old
     * figures here risked them being picked up as the canonical copy.
     */
    cancellationPolicy: {
        moreThan45Days: '10% cancellation charge',
        between15And45Days: '50% cancellation charge',
        within15Days: '100% cancellation charge',
        noShow: '100% cancellation charge',
        festiveAndGroup: 'Non-refundable (festive, long weekend, or more than 3 rooms)',
        note: 'Charges are calculated on the total booking value, not just the advance paid.',
    },
    /** Booking model */
    advancePayment: '100% at booking — no balance at check-in',
};
