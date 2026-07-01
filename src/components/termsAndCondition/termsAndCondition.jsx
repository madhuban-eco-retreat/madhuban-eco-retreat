"use client";

import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
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
        "Safari and special experiences must be paid in full at the time of confirmation.",
        "Room rates are per night on double occupancy and are exclusive of GST. GST is charged separately as applicable — 5% GST on rooms priced at ₹7,500 and below, and 18% GST on rooms priced above ₹7,500.",
        "Prices, offers, and packages are subject to change without prior notice unless confirmed in writing.",
      ],
    },
    {
      title: "2. Check-In & Check-Out",
      items: [
        "Check-in time: 2:00 PM.",
        "Check-out time: 11:30 AM.",
        "Early check-in or late check-out may be permitted subject to availability and may incur additional charges.",
      ],
    },
    {
      title: "3. Cancellation & Refund",
      items: [
        "Cancellations must be communicated to us in writing.",
        "More than 45 days before arrival: 10% cancellation charge.",
        "Between 15 and 45 days before arrival: 50% cancellation charge.",
        "Within 15 days of arrival or in case of a No Show: 100% cancellation charge.",
        "Group bookings (more than 3 rooms) are strictly non-refundable.",
        "Bookings for Christmas, New Year, Holi, Diwali, and long weekends are non-refundable.",
        "Cancellation charges are calculated on the total booking value, not just the advance paid.",
        "Approved refunds are processed via NEFT within 15 working days.",
      ],
    },
    {
      title: "4. Guest Conduct & Safety",
      items: [
        "Guests are expected to respect resort property, staff, and other visitors.",
        "Smoking is permitted only in designated areas.",
        "Use of alcohol, recreational substances, or behavior which endangers others is strictly prohibited.",
        "The management reserves the right to refuse service or accommodation to anyone violating rules or behaving in an unsafe manner.",
      ],
    },
    {
      title: "5. Health & Outdoor Activities",
      items: [
        "Participation in outdoor experiences, forest walks, bird watching, nature trails, and leisure activities is voluntary and at your own risk.",
        "Guests should evaluate personal health suitability before joining any activity.",
        "Madhuban Eco Retreat is not responsible for injuries arising from personal participation in these activities.",
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
