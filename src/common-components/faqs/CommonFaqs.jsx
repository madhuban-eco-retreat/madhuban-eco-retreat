"use client";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { motion } from "framer-motion";
import DecorativeHeading from "../heading/DecorativeHeading";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function CommonFaqs({
  faqs = [],
  heading = "FAQs",
  bgColor = "bg-primary-gray",
  accordionBg = "var(--primary-gray2)",
  accordionColor = "white",
  dense = false,
  maxWidth = "max-w-6xl",
}) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!faqs.length) return <></>;

  return (
    <section className={`py-8 px-4 md:px-8 ${bgColor}`}>
      <div className={`${maxWidth} mx-auto`}>
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading text={"FAQs"} as="h2" textClasses={"w-[200]"} />
          <p className="mt-1 max-w-2xl mx-auto text-base p-text p-text-color px-4 tracking-wide font-arial-narrow">
            Questions for a Meaningful Journey
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1  gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {faqs.map((item, i) => {
            return (
              <motion.div variants={itemVariants} key={i}>
                <Accordion
                  key={i}
                  expanded={expanded === i}
                  onChange={handleChange(i)}
                  style={{
                    margin: 0,
                    overflow: "hidden",
                    borderBottom: dense
                      ? "1px solid var(--color-warm-beige, #E0D1BC)"
                      : "1px solid white",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        style={{ color: accordionColor }}
                      />
                    }
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                      background: accordionBg,
                      color: accordionColor,
                      minHeight: dense ? 44 : undefined,
                      "&.Mui-expanded": {
                        minHeight: dense ? 44 : undefined,
                      },
                      "& .MuiAccordionSummary-content": {
                        margin: dense ? "10px 0" : undefined,
                      },
                    }}
                  >
                    <p className={dense ? "text-sm" : "p-text"}>
                      {item?.question}
                    </p>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={dense ? { padding: "10px 16px 14px" } : undefined}
                  >
                    <p
                      className={
                        dense
                          ? "text-earth-brown text-sm"
                          : "text-primary-gray2 p-text"
                      }
                    >
                      {item?.answer}
                    </p>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Bird Watching in Ratapani | Wilderness Experience Near Bhopal",

  description:
    "Experience bird watching in Ratapani near Bhopal. Spot 70+ native & migratory species during peaceful guided wilderness sessions at Madhuban Eco Retreat.",

  keywords: [
    "bird watching near bhopal",
    "ratapani bird watching",
    "wilderness near bhopal",
    "forest birding mp",
    "migratory birds ratapani",
    "wildlife trails bhopal",
    "eco tourism ratapani",
  ],

  alternates: {
    canonical:
      "https://www.madhubanecoretreat.com/experiences/bird-watching-%26-wilderness",
  },

  robots: {
    index: true,
    follow: true,
  },
};
