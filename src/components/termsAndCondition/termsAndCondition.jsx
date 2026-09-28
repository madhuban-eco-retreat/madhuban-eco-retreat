"use client";

import React from "react";
import { gstSentence } from "@/lib/pricing/rate-card.mjs";
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomBanner from "@/common-components/banner/CustomBanner";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  boxShadow: "0 0px 4px rgba(0,0,0,0.2)",
  borderRadius: theme.spacing(0.5),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  position: "relative",
  width: "fit-content",
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  "&::before": {
    content: '"•"',
    color: "#001538",
    fontWeight: 600,
    position: "absolute",
    left: "8px",
    top: "4px",
  },
  paddingLeft: theme.spacing(3),
}));

const t_and_c_data = {
  title: "Terms And Conditions",
  lastUpdated: "1 August 2025",
  companyName: "VyomEdge",
  website: "info@vyomedge.com",
  description:
    "Welcome to Madhuban Eco Retreat! These Terms & Conditions govern your use of our website, booking services, on-site facilities, experiences, and interactions with our team. By accessing or booking through https://www.madhubanecoretreat.com/, you agree to comply with and be bound by these terms.",
  sections: [
    {
      title: "1. Reservations & Payments",
      items: [
        "All reservations are subject to availability.",
        "A valid online booking, phone confirmation, or email confirmation constitutes a reservation.",
        "A 50% advance payment is required to confirm your booking.",
        "The remaining balance must be paid at least one day prior to arrival.",
        "If the booking is made within 45 days of arrival, full payment is required at the time of booking.",
        "Safari, special experiences and third-party services must be paid in full at the time of confirmation.",
        "Safari confirmation is subject to the availability of permits, forest department rules and applicable government regulations. Full safari payment and guest ID details are required at the time of safari booking.",
        `Room rates are per room per night on double occupancy, on the MAP or AP meal plan chosen at booking. ${gstSentence()}`,
        "Guests who need a GST invoice are requested to share their GST details in advance.",
        "Prices, offers, and packages are subject to change without prior notice unless confirmed in writing.",
      ],
    },
    {
      title: "2. Check-In & Check-Out",
      items: [
        "Check-in time: 2:00 PM.",
        "Check-out time: 11:00 AM.",
        "Early check-in or late check-out may be permitted subject to availability and may incur additional charges.",
        "Guests must carry an original government photo ID for check-in formalities and for safari.",
      ],
    },
    {
      title: "3. Cancellation & Refund",
      items: [
        "Cancellations are accepted only when sent by email.",
        "7 days or less before arrival: 100% of the booking amount.",
        "8 to 21 days before arrival: 20% cancellation charge.",
        "An amendment of dates within 7 days of arrival is treated as a cancellation.",
        "Bookings for Christmas, New Year and notified long weekends are non-refundable.",
        "Group bookings (more than 3 rooms) are strictly non-refundable.",
        "In case of force majeure, Madhuban Eco Retreat may review these terms and the retention policy on a case-to-case basis.",
        "Cancellation charges are calculated on the total booking value, not just the advance paid.",
        "Approved refunds are processed via NEFT within 15 working days.",
      ],
    },
    {
      title: "Free Rescheduling",
      items: [
        "Due to unfavourable travel conditions, guests are encouraged to reschedule instead of cancelling.",
        "There are no rescheduling charges from the resort side up to 8 days before arrival. Forest permit charges apply if safari permits have already been issued.",
        "This option is restricted to bookings affected by force majeure. For a cancellation for any other reason, the regular cancellation policy applies.",
      ],
    },
    {
      title: "4. Guest Conduct & Safety",
      items: [
        "Guests are expected to respect resort property, staff, and other visitors.",
        "Smoking is permitted only in designated areas.",
        "Use of alcohol, recreational substances, or behavior which endangers others is strictly prohibited.",
        "Madhuban Eco Retreat follows Gandhian principles of simplicity, mindful living and respect for all life. Alcohol is not permitted on the premises and only vegetarian food is served; guests are requested not to carry or consume alcohol or non-vegetarian food within the property.",
        "The management reserves the right to refuse service or accommodation to anyone violating rules or behaving in an unsafe manner.",
      ],
    },
    {
      title: "5. Health & Outdoor Activities",
      items: [
        "Participation in outdoor experiences, forest walks, bird watching, nature trails, and leisure activities is voluntary and at your own risk.",
        "Guests should evaluate personal health suitability before joining any activity.",
        "Madhuban Eco Retreat is not responsible for injuries arising from personal participation in these activities.",
        "Included experiences are subject to the resort schedule, weather conditions and prior booking.",
        "Pool operations and outdoor activities are subject to weather and local authority guidelines. In standard cases the pool is open from 7 AM to 9 PM, and pool costume is mandatory.",
        "The retreat is in a forest-fringe landscape; internet, network and digital payment services may occasionally be affected.",
      ],
    },
    {
      title: "6. Property, Liability & Damages",
      items: [
        "Guests are liable for any damage caused to rooms, facilities, equipment, or resort property.",
        "Management reserves the right to charge for repairs, replacements, or additional cleaning if required.",
      ],
    },
    {
      title: "7. Privacy & Personal Information",
      items: [
        "Use of guest data collected during booking, check-in, or website interaction is governed by our Privacy Policy.",
        "We take appropriate measures to protect personal information but are not responsible for third-party security breaches beyond our control.",
      ],
    },
    {
      title: "8. Third-Party Links & Services",
      items: [
        "The website may contain links to external platforms for maps, bookings, social media, or partner services.",
        " Madhuban Eco Retreat is not responsible for content, transactions, policies, or practices of third-party sites.",
      ],
    },
    {
      title: "9. Intellectual Property",
      items: [
        "All content, branding elements, images, text, and digital assets on this site are owned by Madhuban Eco Retreat unless otherwise stated.",
        "Unauthorized use, reproduction, or distribution of any content is prohibited.",
      ],
    },
    {
      title: "10. Amendments",
      items: [
        "Madhuban Eco Retreat reserves the right to modify or update these Terms & Conditions at any time without prior notice.",
        "Continued use of our website, services, or facilities constitutes acceptance of updated terms.",
      ],
    },
  ],
};

export default function TermsAndCondition() {
  return (
    <>
      <CustomBanner
        showLogo={true}
        logoSrc="/logo.png"
        title={"Terms And Conditions"}
        breadcrumbs={[
          {
            name: "Home",
            goesto: "/",
          },
          {
            name: "Terms And Conditions",
            goesto: "/terms-and-condition",
          },
        ]}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <p className="p-text text-justify mb-4">{t_and_c_data?.description}</p>
        {/* Privacy Sections */}
        {t_and_c_data.sections.map((section, index) => (
          <StyledPaper key={index} elevation={2}>
            <SectionTitle
              variant="h5"
              component="h2"
              sx={{ fontSize: { xs: "var(--text-lg)", md: "var(--text-xl)" } }}
            >
              {section.title}
            </SectionTitle>

            {section.content && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {section.content}
              </Typography>
            )}

            {section.websiteUrl && (
              <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
                {section.websiteUrl}
              </Typography>
            )}

            {section.additionalContent && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {section.additionalContent}
              </Typography>
            )}

            {section.items && (
              <List sx={{ py: 0 }}>
                {section.items.map((item, itemIndex) => (
                  <StyledListItem key={itemIndex} disablePadding>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        variant: "body1",
                        sx: {
                          lineHeight: 1.6,
                          fontSize: {
                            xs: "var(--text-sm)",
                            md: "var(--text-sm)",
                          },
                        },
                      }}
                    />
                  </StyledListItem>
                ))}
              </List>
            )}

            {section.subsections &&
              section.subsections.map((subsection, subIndex) => (
                <Box key={subIndex} sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    {subsection.subtitle}
                  </Typography>
                  <List sx={{ py: 0 }}>
                    {subsection.items.map((item, itemIndex) => (
                      <StyledListItem key={itemIndex} disablePadding>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: "body1",
                            sx: { lineHeight: 1.6 },
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </Box>
              ))}

            {section.contactEmail && (
              <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
                {section.contactEmail}
              </Typography>
            )}

            {section.note && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontStyle: "italic",
                  color: "text.secondary",
                  borderLeft: "3px solid #011d4a",
                  pl: 2,
                  py: 1,
                }}
              >
                {section.note}
              </Typography>
            )}

            {section.contactInfo && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {section.contactInfo.company}
                </Typography>
                <Typography variant="body1" color="#000000">
                  {section.contactInfo.email}
                </Typography>
                <Typography variant="body1" color="#000000">
                  {section.contactInfo.phone}
                </Typography>
              </Box>
            )}
          </StyledPaper>
        ))}
      </Container>
    </>
  );
}
