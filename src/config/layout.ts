import { SvgIcons } from './constants'

export const MENU_ITEMS = [
  // { id: "home", label: "home", icon: SvgIcons.home, href: "/home" },
  {
    id: 'terminal',
    label: 'terminal',
    icon: SvgIcons.market,
    href: '/terminal',
    enabled: true,
  },
  {
    id: 'cafe',
    label: 'cafe',
    icon: SvgIcons.cafe,
    href: '/cafe',
    enabled: false,
  },
  {
    id: 'vote',
    label: 'vote',
    icon: SvgIcons.vote,
    href: '/vote',
    enabled: false,
  },
  {
    id: 'market',
    label: 'market',
    icon: SvgIcons.terminal,
    href: '/market',
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
