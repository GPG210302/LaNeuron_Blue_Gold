// All site content lives here so it can be tweaked without touching components.
import {
  Atom, Cpu, Cog, Palette, Sigma, Brain, Sprout, Rocket,
  Lightbulb, TrendingUp, Shapes, Trees, Microscope, Leaf, Apple,
  FlaskConical, ClipboardList, Search, Eye, BarChart3, CheckCircle2,
} from "lucide-react";

export const SITE = {
  name: "La Neuron",
  brand: "La Neuron – STEAM Academy",
  tagline: "Inspiring the next generation of thinkers, makers, and explorers",
  phone: "+48 729 655 422",
  email: "admin@la-neuron.org",
  location: "Kraków",
  venue: "Berka Joselewicza 23, Kraków",
  social: { facebook: "#", instagram: "#" }, // placeholders – to be added later
};

export const NAV = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "What is STEAM?", path: "/what-is-steam" },
  { label: "Why STEAM?", path: "/why-steam" },
  { label: "Programmes", path: "/programmes" },
  { label: "Summer Camp", path: "/summer-camp" },
  { label: "FAQ", path: "/faq" },
];

export const HERO = {
  badge: "Ages 6–13 • Kraków, Poland",
  headline: "Real-World Science for Young Minds",
  sub: "We believe every child is a natural scientist. We give children aged 6–13 the tools, the method, and the wonder to investigate the world around them through hands-on STEAM education.",
  english: "Every session is conducted entirely in English. Children don't just improve their English — they communicate with their peers and educator in English, and learn to think and reason critically in English itself. In today's world, that ability is one of the most valuable skills a child can build.",
  key: "This is not just fun with science materials. Every session follows a proper scientific investigation — hypothesis, experiment, observation, results, and conclusion.",
  image:
    "https://images.pexels.com/photos/8471975/pexels-photo-8471975.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  stats: [
    { value: "6–13", label: "Age range" },
    { value: "Max 10", label: "Per group" },
    { value: "5", label: "STEAM disciplines" },
  ],
};

export const EDUCATOR = {
  name: "Dr. Priyadarshini Gouthaman",
  role: "PhD Cognitive Scientist & Certified Neuroscience Coach",
  intro:
    "I am a PhD graduate in Human Anatomy with a specialisation in Cognitive Science — specifically behaviour, memory, and cognition. I have spent my career understanding how young minds learn, explore, and retain knowledge.",
  philosophyTitle: "My teaching philosophy",
  philosophy:
    "I combine deep scientific knowledge with an understanding of how children's brains actually work. Every session I design is grounded in cognitive science — so children don't just do science, they remember it, understand it, and own it.",
  background: [
    "Former Anatomist at a reputed Medical University",
    "Academic Advisor for a digital educational platform",
    "Secondary Science Educator at an International School in Poland",
    "Certified Neuroscience Coach",
    "Cognitive Specialist supporting children with learning differences, memory challenges, ADHD, dyslexia, and SEN",
    "Experience in exam preparation, revision strategies, handwriting, and cognitive development",
  ],
  highlight:
    "One of the most rewarding parts of my journey is training young children to conduct real research — guiding them to present their work at Jagiellonian University and publish their findings in reputed journals.",
};

export const STEAM = [
  {
    key: "S", word: "Science", icon: Atom, color: "#3B82F6", bg: "#DBEAFE",
    text: "The study of the natural world through observation, questioning, and experimentation. Children learn to ask \"why\" and \"how\" and to design investigations to find answers.",
  },
  {
    key: "T", word: "Technology", icon: Cpu, color: "#10B981", bg: "#D1FAE5",
    text: "Understanding and using tools — from simple instruments like rulers and microscopes to digital tools and basic machines. Technology is about solving problems with what we have.",
  },
  {
    key: "E", word: "Engineering", icon: Cog, color: "#F97316", bg: "#FFEDD5",
    text: "Designing, building, testing, and improving. Engineering teaches children to think in systems — to plan, fail, learn, and try again.",
  },
  {
    key: "A", word: "Art", icon: Palette, color: "#A855F7", bg: "#F3E8FF",
    text: "Creativity, expression, and design thinking. The \"A\" reminds us that science needs imagination. Scientific illustration, data visualisation, and design are all part of this.",
  },
  {
    key: "M", word: "Mathematics", icon: Sigma, color: "#F59E0B", bg: "#FEF3C7",
    text: "The language of science. Counting, measuring, analysing data, identifying patterns, and making predictions are mathematical skills that underpin every other STEAM discipline.",
  },
];

export const WHY = [
  { icon: Brain, color: "#3B82F6", title: "Critical Thinking", text: "STEAM teaches children to question, hypothesise, test, and draw conclusions based on evidence. These thinking skills transfer to every subject and every life decision." },
  { icon: Sprout, color: "#10B981", title: "Growth Mindset", text: "A wrong hypothesis is not failure — it is data. Children learn that effort, iteration, and curiosity matter more than being right the first time." },
  { icon: Rocket, color: "#FB7185", title: "Future Readiness", text: "Most of the fastest-growing careers require STEAM literacy. Early exposure dramatically increases a child's confidence, interest, and aspiration." },
  { icon: Shapes, color: "#A855F7", title: "Creativity & Logic", text: "STEAM bridges the arts and sciences — proving that being creative and being analytical are not opposites. The best thinkers use both." },
  { icon: Lightbulb, color: "#8B5CF6", title: "Brain-Compatible Learning", text: "Learning through investigation, movement, and hands-on discovery is how children's brains are wired to absorb and retain knowledge." },
  { icon: Trees, color: "#F97316", title: "Real-World Connection", text: "STEAM is not confined to a classroom. Children discover that science happens everywhere — in parks, gardens, kitchens, and the sky above them." },
];

export const METHOD = [
  { n: 1, icon: Lightbulb, title: "Hypothesis", text: "Children form their own prediction before the experiment begins.", color: "#3B82F6" },
  { n: 2, icon: ClipboardList, title: "Materials & Methods", text: "Children identify and prepare what they need.", color: "#10B981" },
  { n: 3, icon: FlaskConical, title: "Investigation", text: "Hands-on experiment, including outdoor activities where relevant.", color: "#F97316" },
  { n: 4, icon: Eye, title: "Observation", text: "Children record what they see, measure, and notice.", color: "#A855F7" },
  { n: 5, icon: BarChart3, title: "Results", text: "Data is collected, counted, and compared.", color: "#8B5CF6" },
  { n: 6, icon: CheckCircle2, title: "Conclusion", text: "Children evaluate whether their hypothesis was supported and explain why.", color: "#FB7185" },
];

export const RECEIVE = [
  "Personalised science investigation worksheet for every session",
  "Step-by-step guided recording sheets",
  "Science investigation notebook to take home",
  "The science behind the experiment explained clearly",
];

export const AGE_GROUPS = [
  {
    title: "Young Explorers", ages: "Ages 6–9", color: "#10B981",
    points: ["Simple, sensory-led experiments", "Guided worksheets with pictures and prompts", "Focus on observation and questioning", "Outdoor nature walks and collection activities", "Science drawing and journalling"],
  },
  {
    title: "Junior Scientists", ages: "Ages 10–13", color: "#3B82F6",
    points: ["Full scientific method investigations", "Structured hypothesis, variables, and data recording", "Quantitative results and written conclusions", "Cross-disciplinary STEAM projects", "Presentation of findings to the group"],
  },
];

export const PROGRAMMES = [
  {
    tag: "Regular", title: "Weekly STEAM Workshops", color: "#3B82F6",
    text: "Small group sessions for children aged 6–13. Each week focuses on a different STEAM theme. Children work through complete scientific investigations with worksheets, materials, and outdoor components — both indoor experiments and outdoor discovery.",
    image: "https://images.pexels.com/photos/7869034/pexels-photo-7869034.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    tag: "Upcoming", title: "STEAM Summer Camp 2026", color: "#FB7185", link: "/summer-camp",
    text: "An intensive one-week themed camp running through summer 2026. Each day has a dedicated theme with 3 hours of guided scientific investigation, indoors and outdoors. See the Summer Camp section below for full details.",
    image: "https://images.pexels.com/photos/8471975/pexels-photo-8471975.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    tag: "One-to-one", title: "Cognitive Support Sessions", color: "#10B981",
    text: "Individual sessions for children who need support with memory, learning strategies, exam preparation, handwriting, or cognitive challenges such as ADHD, dyslexia, or other learning differences. Delivered by a certified Neuroscience Coach.",
    image: "https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

export const CAMP_DAYS = [
  {
    day: "Monday", lab: "Wonder Lab", tagline: "Chemical Reactions", icon: FlaskConical, color: "#3B82F6",
    text: "Hands-on chemistry! Children spark fizz, effervescence, and colour-changing reactions themselves — observing every change closely and recording their discoveries just like real scientists.",
  },
  {
    day: "Tuesday", lab: "Build Lab", tagline: "Engineering & Making", icon: Cog, color: "#F97316",
    text: "A day of design challenges. Children design and build simple machines, then test and improve their own creations — learning to plan, fail, iterate, and engineer real solutions.",
  },
  {
    day: "Wednesday", lab: "Bio Lab", tagline: "Animals & Anatomy", icon: Microscope, color: "#A855F7",
    text: "Exploring the living world — animals, human body systems, and anatomy. Children collect specimens themselves and examine them under the microscope to see biology up close.",
  },
  {
    day: "Thursday", lab: "Planet Lab", tagline: "Plants & Environment", icon: Leaf, color: "#22C55E",
    text: "All about plants and our planet. Children study plant structures under the microscope and explore popular 'go-green' techniques — connecting science with caring for the environment.",
  },
  {
    day: "Friday", lab: "Food Lab + Showcase", tagline: "Food Science & Celebration", icon: Apple, color: "#FB7185",
    text: "Morning: the science in the food we eat — health, lifestyle, and how food affects our body systems, through fun activities. Finale: in the last 30 minutes each child presents a favourite discovery from the week, shares results, and celebrates. Parents are warmly invited to this closing session.",
  },
  highlight:
    "One of the most rewarding parts of my journey is training young children to conduct real research — guiding them to present their work at Jagiellonian University and publish their findings in reputed journals."
]
;

export const CAMP_FACTS = [
  { label: "Start date", value: "6 July 2026" },
  { label: "End date", value: "End of August 2026" },
  { label: "Duration", value: "8 weekly camps" },
  { label: "Daily timing", value: "9:00 AM – 12:00 PM" },
  { label: "Days", value: "Monday to Friday" },
  { label: "Group size", value: "Max 10 children" },
  { label: "Location", value: "Stakkato, Kraków" },
  { label: "Language", value: "English" },
];

export const WEEKS = [
  "Week 1", "Week 2", "Week 3", "Week 4",
  "Week 5", "Week 6", "Week 7", "Week 8", "Multiple weeks",
];

export const PROGRAMME_OPTIONS = [
  "Full week camp",
  "Multi-week bundle",
  "Single day",
  "Cognitive support session",
  "Not sure yet",
];

export const FAQ = [
  { q: "What ages can attend?", a: "Children aged 6 to 13 are welcome. Sessions are differentiated — younger children (6–9) follow a guided, sensory-led approach while older children (10–13) complete full scientific investigations." },
  { q: "What language are sessions delivered in?", a: "Sessions are in English, making this ideal for children at international schools or bilingual families in Kraków." },
  { q: "What should my child bring?", a: "All science materials, worksheets, and equipment are provided. Children should bring comfortable clothes for outdoor activities, a water bottle, and a packed snack. An apron is provided for experiments." },
  { q: "What does an outdoor session involve?", a: "On nature days and some other days, children go outside to the area near the venue to collect natural samples — leaves, soil, rocks, insects — which become the subjects of their investigation. All outdoor time is fully supervised." },
  { q: "Is this suitable for children with learning differences?", a: "Yes. The educator holds a Neuroscience Coaching Certificate and has extensive experience supporting children with ADHD, dyslexia, SEN, memory challenges, and other cognitive differences. Please mention any requirements at registration." },
  { q: "Can siblings attend together?", a: "Yes. Siblings within the 6–13 age range are welcome in the same week. A sibling discount is available — mention this when registering." },
  { q: "What will my child bring home?", a: "Every child takes home a personalised science investigation notebook containing all their worksheets, hypotheses, results, and conclusions. Full-week participants also receive a completion certificate." },
  { q: "What is the cancellation policy?", a: "Full refund with more than 7 days' notice before the camp week. Cancellations within 7 days can be transferred to another available week. Contact us directly for urgent situations." },
];
