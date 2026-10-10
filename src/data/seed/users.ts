import type { CountryCode, Role, User } from '../types'

// Fictional employees of the fictional company Nexora. Any resemblance to real
// people is coincidental.
type Row = [
  first: string,
  last: string,
  role: Role,
  jobTitle: string,
  department: string,
  country: CountryCode,
  location: string,
  manager: number | null,
]

const ROWS: Row[] = [
  /* 1 */ ['Eva', 'Lindqvist', 'employee', 'CEO', 'Board', 'NL', 'Amsterdam', null],
  /* 2 */ ['Mark', 'de Wit', 'employee', 'CFO', 'Board', 'NL', 'Amsterdam', 1],
  /* 3 */ ['Marieke', 'Hoekstra', 'employee', 'COO', 'Board', 'NL', 'Eindhoven', 1],
  /* 4 */ ['Mette', 'Nielsen', 'employee', 'Managing Director Nordics', 'Board', 'DK', 'Kopenhagen', 1],
  /* 5 */ ['Lotte', 'Jansen', 'admin', 'Director People & Culture', 'People & Culture', 'NL', 'Amsterdam', 1],
  /* 6 */ ['Pieter', 'Claes', 'employee', 'Country Manager Belgium', 'Board', 'BE', 'Antwerpen', 1],
  /* 7 */ ['Carmen', 'Ruiz', 'employee', 'Managing Director Iberia', 'Board', 'ES', 'Barcelona', 1],
  /* 8 */ ['Daan', 'Mulder', 'employee', 'Finance Manager', 'Finance', 'NL', 'Amsterdam', 2],
  /* 9 */ ['Freja', 'Holm', 'employee', 'Controller', 'Finance', 'DK', 'Kopenhagen', 8],
  /* 10 */ ['Mila', 'de Graaf', 'employee', 'Payroll & Expenses Specialist', 'Finance', 'NL', 'Amsterdam', 8],
  /* 11 */ ['José', 'Martín', 'employee', 'Financial Accountant', 'Finance', 'ES', 'Barcelona', 8],
  /* 12 */ ['Noah', 'Peeters', 'employee', 'Billing Specialist', 'Finance', 'BE', 'Antwerpen', 8],
  /* 13 */ ['Fleur', 'van Dijk', 'employee', 'Head of Marketing', 'Marketing & Communications', 'NL', 'Amsterdam', 1],
  /* 14 */ ['Julia', 'Schneider', 'editor', 'Internal Communications Lead', 'Marketing & Communications', 'NL', 'Amsterdam', 13],
  /* 15 */ ['Ruben', 'Bakker', 'editor', 'Content Creator', 'Marketing & Communications', 'NL', 'Amsterdam', 13],
  /* 16 */ ['Lucía', 'Fernández', 'editor', 'Social Media Manager', 'Marketing & Communications', 'ES', 'Barcelona', 13],
  /* 17 */ ['Bram', 'Smit', 'employee', 'Graphic Designer', 'Marketing & Communications', 'NL', 'Amsterdam', 13],
  /* 18 */ ['Jonas', 'Becker', 'employee', 'Head of IT', 'IT', 'NL', 'Eindhoven', 3],
  /* 19 */ ['Anouk', 'Vos', 'admin', 'Product Owner Digital Workplace', 'IT', 'NL', 'Amsterdam', 18],
  /* 20 */ ['Sanne', 'Visser', 'employee', 'Product Designer', 'Design', 'NL', 'Amsterdam', 35],
  /* 21 */ ['Lukas', 'Fischer', 'employee', 'App Developer', 'IT', 'NL', 'Eindhoven', 18],
  /* 22 */ ['Astrid', 'Larsen', 'employee', 'Data Engineer', 'IT', 'DK', 'Kopenhagen', 18],
  /* 23 */ ['Sem', 'Willems', 'employee', 'Service Desk Engineer', 'IT', 'BE', 'Antwerpen', 18],
  /* 24 */ ['Yara', 'El Amrani', 'employee', 'Security Officer', 'IT', 'NL', 'Eindhoven', 18],
  /* 25 */ ['Max', 'Verbeek', 'employee', 'Head of Engineering', 'Engineering', 'NL', 'Eindhoven', 3],
  /* 26 */ ['Pablo', 'Gómez', 'employee', 'Production Manager', 'Production', 'ES', 'Málaga', 3],
  /* 27 */ ['Elena', 'Torres', 'employee', 'Assembly Planner', 'Production', 'ES', 'Málaga', 26],
  /* 28 */ ['Lisa', 'Koster', 'employee', 'Battery Engineer', 'Engineering', 'NL', 'Eindhoven', 25],
  /* 29 */ ['Tim', 'de Boer', 'employee', 'Test Rider & Quality Lead', 'Engineering', 'NL', 'Eindhoven', 25],
  /* 30 */ ['Elif', 'Yılmaz', 'employee', 'Mechanical Engineer', 'Engineering', 'NL', 'Eindhoven', 25],
  /* 31 */ ['Lars', 'Dekker', 'employee', 'Warehouse Coordinator', 'Production', 'NL', 'Eindhoven', 26],
  /* 32 */ ['Emma', 'Maes', 'employee', 'Store Manager Antwerpen', 'Retail', 'BE', 'Antwerpen', 6],
  /* 33 */ ['Javier', 'López', 'employee', 'Assembly Technician', 'Production', 'ES', 'Málaga', 26],
  /* 34 */ ['Nina', 'Schouten', 'employee', 'Frame Designer', 'Design', 'NL', 'Amsterdam', 35],
  /* 35 */ ['Milan', 'Bos', 'employee', 'Head of Design', 'Design', 'NL', 'Amsterdam', 1],
  /* 36 */ ['Sofie', 'Andersen', 'employee', 'Store Manager Kopenhagen', 'Retail', 'DK', 'Kopenhagen', 4],
  /* 37 */ ['Ravi', 'Kapoor', 'employee', 'UX Designer', 'Design', 'NL', 'Amsterdam', 35],
  /* 38 */ ['Klara', 'Berg', 'employee', 'Sales Advisor', 'Retail', 'DK', 'Kopenhagen', 36],
  /* 39 */ ['Mikkel', 'Jensen', 'employee', 'Bike Mechanic', 'Retail', 'DK', 'Kopenhagen', 36],
  /* 40 */ ['Iris', 'Hendriks', 'employee', 'Head of Customer Care', 'Customer Care', 'NL', 'Amsterdam', 3],
  /* 41 */ ['Lucas', 'Jacobs', 'employee', 'Customer Care Agent', 'Customer Care', 'BE', 'Antwerpen', 40],
  /* 42 */ ['Amira', 'Haddad', 'employee', 'Customer Care Agent', 'Customer Care', 'NL', 'Amsterdam', 40],
  /* 43 */ ['Diego', 'Navarro', 'employee', 'Customer Success Manager', 'Customer Care', 'ES', 'Barcelona', 40],
  /* 44 */ ['Roos', 'Kuipers', 'employee', 'Sales Director', 'Sales', 'NL', 'Amsterdam', 1],
  /* 45 */ ['Matteo', 'Rossi', 'employee', 'Dealer Manager', 'Sales', 'ES', 'Barcelona', 44],
  /* 46 */ ['Charlotte', 'Dubois', 'employee', 'Dealer Manager', 'Sales', 'BE', 'Antwerpen', 44],
  /* 47 */ ['Wouter', 'Prins', 'employee', 'Fleet Sales Manager', 'Sales', 'NL', 'Amsterdam', 44],
  /* 48 */ ['Ida', 'Christensen', 'employee', 'Sales Support', 'Sales', 'DK', 'Kopenhagen', 44],
  /* 49 */ ['Stijn', 'Vermeulen', 'employee', 'Business Developer', 'Sales', 'BE', 'Antwerpen', 44],
  /* 50 */ ['Paula', 'Sánchez', 'employee', 'HR Business Partner', 'People & Culture', 'ES', 'Barcelona', 5],
  /* 51 */ ['Joris', 'van Leeuwen', 'employee', 'HR Advisor', 'People & Culture', 'NL', 'Eindhoven', 5],
  /* 52 */ ['Emil', 'Sørensen', 'employee', 'Payroll Specialist', 'People & Culture', 'DK', 'Kopenhagen', 5],
  /* 53 */ ['Ayoub', 'Benali', 'employee', 'Recruiter', 'People & Culture', 'NL', 'Amsterdam', 5],
  /* 54 */ ['Greta', 'de Lange', 'employee', 'Learning & Development Advisor', 'People & Culture', 'NL', 'Amsterdam', 5],
  /* 55 */ ['Thijs', 'Kok', 'employee', 'Facility Manager', 'Facilities', 'NL', 'Eindhoven', 3],
  /* 56 */ ['Marta', 'Gil', 'employee', 'Office Manager', 'Facilities', 'ES', 'Barcelona', 55],
  /* 57 */ ['Arne', 'Wouters', 'employee', 'Sustainability Officer', 'Facilities', 'BE', 'Antwerpen', 55],
  /* 58 */ ['Vera', 'Scholten', 'employee', 'Legal Counsel', 'Legal', 'NL', 'Amsterdam', 2],
  /* 59 */ ['Kees', 'Brouwer', 'employee', 'Works Council Chair', 'Works Council', 'NL', 'Eindhoven', 1],
  /* 60 */ ['Linde', 'Peters', 'employee', 'Management Assistant', 'Board', 'NL', 'Amsterdam', 1],
]

const SKILLS: Record<string, string[]> = {
  Board: ['Strategy', 'Leadership', 'Cycling'],
  Finance: ['Excel', 'Reporting', 'Forecasting', 'Expenses'],
  'Marketing & Communications': ['Copywriting', 'Photography', 'Social media', 'Video'],
  IT: ['Cloud', 'TypeScript', 'Security', 'Service management'],
  Design: ['Figma', 'Sketching', '3D modelling', 'User research'],
  Engineering: ['CAD', 'Batteries', 'Prototyping', 'Testing'],
  Production: ['Lean', 'Planning', 'Assembly', 'Quality'],
  Retail: ['Customer advice', 'Bike repair', 'Test rides'],
  'Customer Care': ['Customer contact', 'Problem solving', 'CRM'],
  Sales: ['Negotiation', 'Dealer network', 'Lease plans'],
  'People & Culture': ['Coaching', 'Recruitment', 'Labour law', 'Payroll'],
  Facilities: ['Facility management', 'Sustainability', 'Health & safety'],
  Legal: ['Contracts', 'GDPR', 'Compliance'],
  'Works Council': ['Co-determination', 'Consultation'],
}

const BIOS = [
  'Altijd bereid om te helpen — stuur gerust een bericht.',
  'Eerst koffie, dan de rest.',
  'Fietst elke dag naar kantoor, ook als het regent.',
  'In het weekend op de racefiets of in de keuken.',
  'Vraag me gerust alles over ons werk.',
  'Verzamelt kamerplanten en slechte woordgrappen.',
]

const PHONE_PREFIX: Record<CountryCode, string> = {
  NL: '+31 20 555',
  BE: '+32 3 555',
  DK: '+45 33 555',
  ES: '+34 93 555',
}

const emailPart = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ø/g, 'o')
    .replace(/ı/g, 'i')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase()

export const userId = (n: number) => `u${String(n).padStart(2, '0')}`

export const seedUsers = (): User[] =>
  ROWS.map(([first, last, role, jobTitle, department, country, location, manager], i) => {
    const n = i + 1
    return {
      id: userId(n),
      firstName: first,
      lastName: last,
      role,
      jobTitle,
      department,
      country,
      location,
      email: `${emailPart(first)}.${emailPart(last)}@nexora.example`,
      phone: `${PHONE_PREFIX[country]} ${String(1000 + n * 37).slice(-4)}`,
      bio: BIOS[n % BIOS.length],
      skills: SKILLS[department] ?? [],
      managerId: manager === null ? null : userId(manager),
    }
  })

/** Accounts offered on the demo login screen, one per role. */
export const DEMO_ACCOUNTS = {
  employee: userId(20),
  editor: userId(15),
  admin: userId(5),
} as const
