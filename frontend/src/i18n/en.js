export const en = {
  // …everything above stays the same…

  weeks: undefined, // no longer needed now that we don't use "Preferred week"

  programmeOptions: [
    "STEAM-themed workshop",
    "Cyclic STEAM workshop",
    "Single day",
    "Cognitive support session",
    "Not sure yet",
  ],

  // …faq, footer, events, etc. stay the same…

  register: {
    overline: "Register / Enquiry",
    heading: "Reserve Your Child Spot",
    subtext:
      "Spots are limited to a maximum of 10 children per week to ensure every child receives personal attention. Submit the form and you will receive a response within 24 hours.",
    promises: [
      "Personal response within 24 hours",
      "Mention allergies or learning needs",
      "Sibling discount available",
    ],
    labels: {
      parentName: "Parent / guardian full name *",
      email: "Email address *",
      phone: "Phone / WhatsApp (optional)",
      childName: "Child first name *",
      childAge: "Child age (6-14) *",
      // changed from Preferred week:
      startDate: "Preferred start date *",
      endDate: "Preferred end date *",
      programmeInterest: "Programme interest *",
      message: "Questions, allergies, or learning needs (optional)",
      // new label for contact method
      preferredContact: "Preferred contact method (you can choose more than one)",
    },
    placeholders: {
      parentName: "Your full name",
      email: "you@email.com",
      childAge: "e.g. 9",
      // no week placeholder now
      programme: "Select an option",
      message: "Anything the educator should know",
    },
    submit: "Submit Enquiry",
    sending: "Sending...",
    privacy:
      "Your details are kept private and used only to respond to your enquiry.",
    successHeading: "Enquiry received!",
    successText:
      "Thank you. A personal response from Dr. Priyadarshini will follow within 24 hours.",
    successBtn: "Submit another enquiry",
    errorRequired: "Please fill in all required fields.",
    errorGeneral:
      "Something went wrong. Please try again or email [admin@laneuron.org](mailto:admin@laneuron.org) directly.",
  },
};