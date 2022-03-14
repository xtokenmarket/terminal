import { SvgIcons } from './constants'

export const MENU_ITEMS = [
  // { id: "home", label: "home", icon: SvgIcons.home, href: "/home" },
  {
    id: 'mining',
    label: 'liquidity mining',
    icon: SvgIcons.mining,
    href: '/mining',
    enabled: true,
  },
  {
    id: 'origination',
    label: 'origination',
    icon: SvgIcons.origination,
    href: '/origination',
    enabled: false,
  },
  {
    id: 'auction',
    label: 'liquidity auction',
    icon: SvgIcons.auction,
    href: '/auction',
    enabled: false,
  },
  {
    id: 'native',
    label: 'native collateral',
    icon: SvgIcons.native,
    href: '/native',
    enabled: false,
  },
]

export const SOCIAL_ITEMS = [
  {
    id: 'github',
    label: 'github',
    icon: SvgIcons.github,
    href: 'https://github.com/xtokenmarket',
  },
  {
    id: 'twitter',
    label: 'twitter',
    icon: SvgIcons.twitter,
    href: 'https://twitter.com/xtokenterminal',
  },
  {
    id: 'discord',
    label: 'discord',
    icon: SvgIcons.discord,
    href: 'https://discord.gg/QCp8QBWB72',
  },
]
