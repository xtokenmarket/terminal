import { SvgIcons } from './constants'

export const MENU_ITEMS = [
  {
    id: 'terminal',
    label: 'terminal',
    icon: SvgIcons.home,
    href: '/',
    enabled: true,
  },
  {
    id: 'mining',
    label: 'mining',
    icon: SvgIcons.mining,
    href: '/mining',
    enabled: true,
  },
  {
    id: 'origination',
    label: 'origination',
    icon: SvgIcons.origination,
    href: '/origination',
    enabled: true,
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
  {
    id: 'minter',
    label: 'Minter',
    icon: SvgIcons.minter,
    href: '/minter',
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
