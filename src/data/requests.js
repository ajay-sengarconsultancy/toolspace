export const requestStatuses = [
  "Requested",
  "Under Review",
  "Scheduled",
  "In Development",
  "Available",
];

export const requestCategories = [
  "Finance & operations",
  "Marketing & sales",
  "Design & content",
  "Product & development",
  "People & hiring",
  "Other",
];

export const mockRequests = [
  {
    id: "request-demo-1",
    title: "A simple way to track contractor invoices",
    problem: "I lose time matching contractor invoices to project budgets and payment dates.",
    category: "Finance & operations",
    referenceUrl: "",
    additionalDetails: "A lightweight view with due dates would be helpful.",
    status: "Under Review",
    voteCount: 34,
    votedByMe: false,
    createdAt: "2026-10-27T12:00:00.000Z",
  },
  {
    id: "request-demo-2",
    title: "Founder-friendly cap table overview",
    problem: "Early teams need a clear place to understand ownership without a complex platform.",
    category: "Finance & operations",
    referenceUrl: "",
    additionalDetails: "",
    status: "Scheduled",
    eta: "January 2027",
    voteCount: 52,
    votedByMe: false,
    createdAt: "2026-10-19T12:00:00.000Z",
  },
  {
    id: "request-demo-3",
    title: "A shared customer interview library",
    problem: "Research notes are scattered across documents and hard for a small team to revisit.",
    category: "Product & development",
    referenceUrl: "",
    additionalDetails: "",
    status: "In Development",
    voteCount: 21,
    votedByMe: false,
    createdAt: "2026-10-12T12:00:00.000Z",
  },
];

export const roadmapGroups = [
  { status: "Requested", description: "New ideas shared by the community." },
  { status: "Under Review", description: "We’re looking at the problem and who it could help." },
  { status: "Scheduled", description: "Selected for an upcoming build cycle." },
  { status: "In Development", description: "Work is underway on the tool." },
  { status: "Available", description: "Ready to use on Toolspace." },
];
