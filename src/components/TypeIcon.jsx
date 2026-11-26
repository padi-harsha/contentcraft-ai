import { Briefcase, Camera, Globe, Mail, Megaphone, MessageCircle, PenLine, Search, ShoppingBag, Video, FileText } from 'lucide-react'

const ICONS = {
  blog: PenLine,
  social: MessageCircle,
  instagram: Camera,
  linkedin: Briefcase,
  marketing: Megaphone,
  product: ShoppingBag,
  email: Mail,
  youtube: Video,
  website: Globe,
  seo: Search,
}

export default function TypeIcon({ type, size = 18 }) {
  const Icon = ICONS[type] || FileText
  return <Icon size={size} aria-hidden="true" />
}
