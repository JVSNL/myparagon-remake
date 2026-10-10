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
  /* 1 */ ['Eva', 'Lindqvist', 'employee', 'CEO Central Europe', 'Board', 'NL', 'Utrecht', null],
  /* 2 */ ['Thomas', 'Weber', 'employee', 'CFO', 'Board', 'DE', 'Keulen', 1],
  /* 3 */ ['Marieke', 'Hoekstra', 'employee', 'COO', 'Board', 'NL', 'Zwolle', 1],
  /* 4 */ ['Jakub', 'Nowak', 'employee', 'Managing Director CEE', 'Board', 'PL', 'Poznań', 1],
  /* 5 */ ['Lotte', 'Jansen', 'admin', 'HR Director', 'Human Resources', 'NL', 'Utrecht', 1],
  /* 6 */ ['Pieter', 'Claes', 'employee', 'Country Manager Belgium', 'Board', 'BE', 'Gent', 1],
  /* 7 */ ['Sophie', 'Brandt', 'employee', 'Finance Director', 'Finance', 'DE', 'Keulen', 2],
  /* 8 */ ['Daan', 'Mulder', 'employee', 'Controller', 'Finance', 'NL', 'Utrecht', 7],
  /* 9 */ ['Lena', 'Hoffmann', 'employee', 'Financial Accountant', 'Finance', 'DE', 'Keulen', 7],
  /* 10 */ ['Mila', 'de Graaf', 'employee', 'Accounts Payable Specialist', 'Finance', 'NL', 'Zwolle', 8],
  /* 11 */ ['Ondřej', 'Svoboda', 'employee', 'Accounts Receivable Specialist', 'Finance', 'CZ', 'Brno', 8],
  /* 12 */ ['Noah', 'Peeters', 'employee', 'Billing Specialist', 'Finance', 'BE', 'Gent', 8],
  /* 13 */ ['Fleur', 'van Dijk', 'employee', 'Head of Marketing & Communications', 'Marketing & Communications', 'NL', 'Utrecht', 1],
  /* 14 */ ['Julia', 'Schneider', 'editor', 'Internal Communications Lead', 'Marketing & Communications', 'DE', 'Keulen', 13],
  /* 15 */ ['Ruben', 'Bakker', 'editor', 'Communications Advisor', 'Marketing & Communications', 'NL', 'Utrecht', 13],
  /* 16 */ ['Zofia', 'Kowalska', 'editor', 'Content Marketer', 'Marketing & Communications', 'PL', 'Poznań', 13],
  /* 17 */ ['Bram', 'Smit', 'employee', 'Graphic Designer', 'Marketing & Communications', 'NL', 'Zwolle', 13],
  /* 18 */ ['Jonas', 'Becker', 'employee', 'Head of IT', 'IT', 'DE', 'Dresden', 3],
  /* 19 */ ['Anouk', 'Vos', 'admin', 'Product Owner Digital Workplace', 'IT', 'NL', 'Utrecht', 18],
  /* 20 */ ['Sanne', 'Visser', 'employee', 'Financial Analyst', 'Finance', 'NL', 'Utrecht', 8],
  /* 21 */ ['Lukas', 'Fischer', 'employee', 'Software Engineer', 'IT', 'DE', 'Dresden', 18],
  /* 22 */ ['Tereza', 'Dvořáková', 'employee', 'Data Engineer', 'IT', 'CZ', 'Brno', 18],
  /* 23 */ ['Sem', 'Willems', 'employee', 'Service Desk Engineer', 'IT', 'BE', 'Gent', 18],
  /* 24 */ ['Yara', 'El Amrani', 'employee', 'Security Officer', 'IT', 'NL', 'Breda', 18],
  /* 25 */ ['Max', 'Wagner', 'employee', 'Operations Manager Print', 'Operations', 'DE', 'Keulen', 3],
  /* 26 */ ['Femke', 'Meijer', 'employee', 'Operations Manager Fulfilment', 'Operations', 'NL', 'Zwolle', 3],
  /* 27 */ ['Kacper', 'Wiśniewski', 'employee', 'Production Planner', 'Operations', 'PL', 'Poznań', 25],
  /* 28 */ ['Lisa', 'Koch', 'employee', 'Print Operator', 'Operations', 'DE', 'Keulen', 25],
  /* 29 */ ['Tim', 'de Boer', 'employee', 'Team Lead Production', 'Operations', 'NL', 'Breda', 25],
  /* 30 */ ['Elif', 'Yılmaz', 'employee', 'Quality Engineer', 'Operations', 'DE', 'Keulen', 25],
  /* 31 */ ['Lars', 'Dekker', 'employee', 'Warehouse Coordinator', 'Logistics', 'NL', 'Zwolle', 26],
  /* 32 */ ['Emma', 'Maes', 'employee', 'Logistics Planner', 'Logistics', 'BE', 'Gent', 26],
  /* 33 */ ['Jan', 'Novák', 'employee', 'Fulfilment Specialist', 'Logistics', 'CZ', 'Brno', 26],
  /* 34 */ ['Nina', 'Schulz', 'employee', 'Packaging Engineer', 'Logistics', 'DE', 'Dresden', 26],
  /* 35 */ ['Milan', 'Bos', 'employee', 'Process Improvement Lead', 'Operations', 'NL', 'Breda', 3],
  /* 36 */ ['Hanna', 'Lewandowska', 'employee', 'Process Outsourcing Manager', 'Process Services', 'PL', 'Poznań', 4],
  /* 37 */ ['Ravi', 'Kapoor', 'employee', 'Automation Specialist', 'Process Services', 'NL', 'Utrecht', 36],
  /* 38 */ ['Klara', 'Zimmermann', 'employee', 'Back Office Team Lead', 'Process Services', 'DE', 'Keulen', 36],
  /* 39 */ ['Piotr', 'Zieliński', 'employee', 'Document Processing Specialist', 'Process Services', 'PL', 'Poznań', 36],
  /* 40 */ ['Iris', 'Hendriks', 'employee', 'Customer Service Manager', 'Customer Service', 'NL', 'Breda', 6],
  /* 41 */ ['Lucas', 'Jacobs', 'employee', 'Customer Service Agent', 'Customer Service', 'BE', 'Gent', 40],
  /* 42 */ ['Amira', 'Haddad', 'employee', 'Customer Service Agent', 'Customer Service', 'NL', 'Breda', 40],
  /* 43 */ ['Felix', 'Richter', 'employee', 'Customer Success Manager', 'Customer Service', 'DE', 'Keulen', 40],
  /* 44 */ ['Roos', 'Kuipers', 'employee', 'Sales Director', 'Sales', 'NL', 'Utrecht', 1],
  /* 45 */ ['Matteo', 'Rossi', 'employee', 'Account Manager', 'Sales', 'DE', 'Keulen', 44],
  /* 46 */ ['Charlotte', 'Dubois', 'employee', 'Account Manager', 'Sales', 'BE', 'Gent', 44],
  /* 47 */ ['Wouter', 'Prins', 'employee', 'Business Developer', 'Sales', 'NL', 'Zwolle', 44],
  /* 48 */ ['Agnieszka', 'Wójcik', 'employee', 'Sales Support', 'Sales', 'PL', 'Poznań', 44],
  /* 49 */ ['Stijn', 'Vermeulen', 'employee', 'Bid Manager', 'Sales', 'BE', 'Gent', 44],
  /* 50 */ ['Paula', 'Krüger', 'employee', 'HR Business Partner', 'Human Resources', 'DE', 'Keulen', 5],
  /* 51 */ ['Joris', 'van Leeuwen', 'employee', 'HR Advisor', 'Human Resources', 'NL', 'Zwolle', 5],
  /* 52 */ ['Petra', 'Horáková', 'employee', 'Payroll Specialist', 'Human Resources', 'CZ', 'Brno', 5],
  /* 53 */ ['Ayoub', 'Benali', 'employee', 'Recruiter', 'Human Resources', 'NL', 'Utrecht', 5],
  /* 54 */ ['Greta', 'Lange', 'employee', 'Learning & Development Advisor', 'Human Resources', 'DE', 'Dresden', 5],
  /* 55 */ ['Thijs', 'Kok', 'employee', 'Facility Manager', 'Facilities', 'NL', 'Zwolle', 3],
  /* 56 */ ['Marta', 'Kamińska', 'employee', 'Office Manager', 'Facilities', 'PL', 'Poznań', 55],
  /* 57 */ ['Arne', 'Wouters', 'employee', 'Sustainability Officer', 'Facilities', 'BE', 'Gent', 55],
  /* 58 */ ['Vera', 'Scholten', 'employee', 'Legal Counsel', 'Legal', 'NL', 'Utrecht', 2],
  /* 59 */ ['Moritz', 'Braun', 'employee', 'Works Council Chair', 'Works Council', 'DE', 'Keulen', 1],
  /* 60 */ ['Linde', 'Peters', 'employee', 'Management Assistant', 'Board', 'NL', 'Utrecht', 1],
]

const SKILLS: Record<string, string[]> = {
  Board: ['Strategy', 'Leadership', 'Stakeholder management'],
  Finance: ['Excel', 'Reporting', 'Business Central', 'Forecasting'],
  'Marketing & Communications': ['Copywriting', 'Storytelling', 'Social media', 'Design'],
  IT: ['Cloud', 'TypeScript', 'Security', 'Service management'],
  Operations: ['Lean', 'Planning', 'Print production', 'Quality'],
  Logistics: ['Warehousing', 'Planning', 'Supply chain'],
  'Process Services': ['Automation', 'Process mapping', 'Document processing'],
  'Customer Service': ['Customer contact', 'Problem solving', 'CRM'],
  Sales: ['Negotiation', 'Account management', 'Tenders'],
  'Human Resources': ['Coaching', 'Recruitment', 'Labour law', 'Payroll'],
  Facilities: ['Facility management', 'Sustainability', 'Health & safety'],
  Legal: ['Contracts', 'GDPR', 'Compliance'],
  'Works Council': ['Co-determination', 'Consultation'],
}

const BIOS = [
  'Altijd bereid om te helpen — stuur gerust een bericht.',
  'Eerst koffie, dan spreadsheets.',
  'Altijd op zoek naar manieren om ons werk net wat makkelijker te maken.',
  'In het weekend op de racefiets of in de keuken.',
  'Vraag me gerust alles over onze processen.',
  'Trots op ons team en het werk dat we elke dag leveren.',
]

const PHONE_PREFIX: Record<CountryCode, string> = {
  NL: '+31 20 555',
  BE: '+32 9 555',
  DE: '+49 221 555',
  PL: '+48 61 555',
  CZ: '+420 5 555',
}

const emailPart = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
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
