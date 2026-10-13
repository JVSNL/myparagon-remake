import {
  Bike,
  BookOpen,
  CalendarClock,
  Car,
  Clock,
  FileText,
  GraduationCap,
  Laptop,
  LifeBuoy,
  Link as LinkIcon,
  Mail,
  Palmtree,
  Receipt,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

/** Icons a launchpad tile can use (LaunchpadLink.icon). */
export const LAUNCHPAD_ICONS: Record<string, LucideIcon> = {
  'calendar-clock': CalendarClock,
  palmtree: Palmtree,
  receipt: Receipt,
  'life-buoy': LifeBuoy,
  bike: Bike,
  'graduation-cap': GraduationCap,
  clock: Clock,
  wallet: Wallet,
  laptop: Laptop,
  mail: Mail,
  users: Users,
  'book-open': BookOpen,
  'file-text': FileText,
  'shield-check': ShieldCheck,
  car: Car,
  link: LinkIcon,
}

export const launchpadIcon = (name: string): LucideIcon => LAUNCHPAD_ICONS[name] ?? LinkIcon
