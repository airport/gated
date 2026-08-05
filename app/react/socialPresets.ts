export type InputKind = 'handle' | 'url' | 'invite'

export type PlatformId =
  | 'youtube'
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'discord'
  | 'twitch'
  | 'facebook'
  | 'telegram'
  | 'linkedin'

export type SocialPreset = {
  id: string
  platformId: PlatformId
  platform: string
  label: string
  inputKind: InputKind
  placeholder: string
  prefix?: string
  brand: string
  brandText?: string
}

export const SOCIAL_PRESETS: SocialPreset[] = [
  {
    id: 'youtube:subscribe',
    platformId: 'youtube',
    platform: 'YouTube',
    label: 'Subscribe to channel',
    inputKind: 'handle',
    placeholder: 'channel or handle',
    prefix: '@',
    brand: '#FF0000',
  },
  {
    id: 'youtube:like',
    platformId: 'youtube',
    platform: 'YouTube',
    label: 'Like video',
    inputKind: 'url',
    placeholder: 'https://youtube.com/watch?v=…',
    brand: '#FF0000',
  },
  {
    id: 'youtube:comment',
    platformId: 'youtube',
    platform: 'YouTube',
    label: 'Comment on video',
    inputKind: 'url',
    placeholder: 'https://youtube.com/watch?v=…',
    brand: '#FF0000',
  },
  {
    id: 'instagram:follow',
    platformId: 'instagram',
    platform: 'Instagram',
    label: 'Follow account',
    inputKind: 'handle',
    placeholder: 'username',
    prefix: '@',
    brand: '#E4405F',
  },
  {
    id: 'instagram:like',
    platformId: 'instagram',
    platform: 'Instagram',
    label: 'Like post',
    inputKind: 'url',
    placeholder: 'https://instagram.com/p/…',
    brand: '#E4405F',
  },
  {
    id: 'instagram:comment',
    platformId: 'instagram',
    platform: 'Instagram',
    label: 'Comment on post',
    inputKind: 'url',
    placeholder: 'https://instagram.com/p/…',
    brand: '#E4405F',
  },
  {
    id: 'x:follow',
    platformId: 'x',
    platform: 'X',
    label: 'Follow account',
    inputKind: 'handle',
    placeholder: 'username',
    prefix: '@',
    brand: '#111111',
    brandText: '#ffffff',
  },
  {
    id: 'x:like',
    platformId: 'x',
    platform: 'X',
    label: 'Like post',
    inputKind: 'url',
    placeholder: 'https://x.com/…/status/…',
    brand: '#111111',
    brandText: '#ffffff',
  },
  {
    id: 'x:repost',
    platformId: 'x',
    platform: 'X',
    label: 'Repost',
    inputKind: 'url',
    placeholder: 'https://x.com/…/status/…',
    brand: '#111111',
    brandText: '#ffffff',
  },
  {
    id: 'tiktok:follow',
    platformId: 'tiktok',
    platform: 'TikTok',
    label: 'Follow account',
    inputKind: 'handle',
    placeholder: 'username',
    prefix: '@',
    brand: '#010101',
    brandText: '#ffffff',
  },
  {
    id: 'tiktok:like',
    platformId: 'tiktok',
    platform: 'TikTok',
    label: 'Like video',
    inputKind: 'url',
    placeholder: 'https://tiktok.com/@…/video/…',
    brand: '#010101',
    brandText: '#ffffff',
  },
  {
    id: 'tiktok:comment',
    platformId: 'tiktok',
    platform: 'TikTok',
    label: 'Comment on video',
    inputKind: 'url',
    placeholder: 'https://tiktok.com/@…/video/…',
    brand: '#010101',
    brandText: '#ffffff',
  },
  {
    id: 'discord:join',
    platformId: 'discord',
    platform: 'Discord',
    label: 'Join server',
    inputKind: 'invite',
    placeholder: 'discord.gg/invite',
    brand: '#5865F2',
  },
  {
    id: 'twitch:follow',
    platformId: 'twitch',
    platform: 'Twitch',
    label: 'Follow channel',
    inputKind: 'handle',
    placeholder: 'channel',
    brand: '#9146FF',
  },
  {
    id: 'twitch:subscribe',
    platformId: 'twitch',
    platform: 'Twitch',
    label: 'Subscribe to channel',
    inputKind: 'handle',
    placeholder: 'channel',
    brand: '#9146FF',
  },
  {
    id: 'facebook:follow',
    platformId: 'facebook',
    platform: 'Facebook',
    label: 'Follow page',
    inputKind: 'url',
    placeholder: 'https://facebook.com/…',
    brand: '#1877F2',
  },
  {
    id: 'facebook:like',
    platformId: 'facebook',
    platform: 'Facebook',
    label: 'Like page',
    inputKind: 'url',
    placeholder: 'https://facebook.com/…',
    brand: '#1877F2',
  },
  {
    id: 'telegram:join',
    platformId: 'telegram',
    platform: 'Telegram',
    label: 'Join channel',
    inputKind: 'handle',
    placeholder: 'channel',
    prefix: '@',
    brand: '#26A5E4',
  },
  {
    id: 'linkedin:follow',
    platformId: 'linkedin',
    platform: 'LinkedIn',
    label: 'Follow page',
    inputKind: 'url',
    placeholder: 'https://linkedin.com/company/…',
    brand: '#0A66C2',
  },
]

export function getPreset(id: string): SocialPreset | undefined {
  return SOCIAL_PRESETS.find((p) => p.id === id)
}

export function presetsByPlatform(): [string, SocialPreset[]][] {
  const map = new Map<string, SocialPreset[]>()
  for (const preset of SOCIAL_PRESETS) {
    const list = map.get(preset.platform) ?? []
    list.push(preset)
    map.set(preset.platform, list)
  }
  return [...map.entries()]
}

export function resolveDestination(preset: SocialPreset, value: string): string {
  const v = value.trim().replace(/^@/, '')
  if (!v) return ''

  switch (preset.id) {
    case 'youtube:subscribe':
      return `https://youtube.com/@${v}`
    case 'instagram:follow':
      return `https://instagram.com/${v}`
    case 'x:follow':
      return `https://x.com/${v}`
    case 'tiktok:follow':
      return `https://tiktok.com/@${v}`
    case 'twitch:follow':
    case 'twitch:subscribe':
      return `https://twitch.tv/${v}`
    case 'telegram:join':
      return `https://t.me/${v}`
    case 'discord:join':
      return v.startsWith('http')
        ? v
        : `https://discord.gg/${v.replace(/^discord\.gg\//i, '')}`
    default:
      return v.startsWith('http') ? v : `https://${v}`
  }
}
