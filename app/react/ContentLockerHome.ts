import {
  createElement,
  useMemo,
  useState,
  Theme,
  Heading,
  Text,
  Badge,
  IconButton,
  TextField,
  Select,
  Trash16,
  Lock20,
  Youtube20,
  Instagram20,
  Twitter20,
  Tiktok20,
  Discord20,
  Twitch20,
  Facebook20,
  Telegram20,
  Linkedin20,
  type ReactNode,
  type ComponentType,
} from 'virtual:frosted-ui'
import {
  SOCIAL_PRESETS,
  getPreset,
  presetsByPlatform,
  resolveDestination,
  type PlatformId,
  type SocialPreset,
} from './socialPresets'

type LockerAction = {
  id: string
  presetId: string
  value: string
}

const PLATFORM_ICONS: Record<
  PlatformId,
  ComponentType<{ className?: string }>
> = {
  youtube: Youtube20,
  instagram: Instagram20,
  x: Twitter20,
  tiktok: Tiktok20,
  discord: Discord20,
  twitch: Twitch20,
  facebook: Facebook20,
  telegram: Telegram20,
  linkedin: Linkedin20,
}

function el(
  type: Parameters<typeof createElement>[0],
  props: Record<string, unknown> | null,
  ...children: ReactNode[]
) {
  return createElement(type, props, ...children)
}

function uid() {
  return `act_${Math.random().toString(36).slice(2, 9)}`
}

const DEFAULT_ACTIONS: LockerAction[] = [
  { id: uid(), presetId: 'youtube:subscribe', value: '' },
  { id: uid(), presetId: 'discord:join', value: '' },
]

const PANEL_CANVAS =
  'radial-gradient(120% 80% at 50% 0%, #3b82f6 0%, #1e3a8a 34%, #0b1224 70%, #070a12 100%)'

function BrandButton({
  preset,
  onClick,
}: {
  preset: SocialPreset
  onClick: () => void
}) {
  const Icon = PLATFORM_ICONS[preset.platformId]
  return el(
    'button',
    {
      type: 'button',
      className: 'gated-brand-btn',
      style: {
        background: preset.brand,
        color: preset.brandText ?? '#ffffff',
      },
      onClick,
    },
    el(Icon, { className: 'gated-brand-btn__icon' }),
    el('span', null, preset.label),
  )
}

export function ContentLockerHome() {
  const [actions, setActions] = useState<LockerAction[]>(DEFAULT_ACTIONS)
  const [pickerKey, setPickerKey] = useState(0)
  const groups = useMemo(() => presetsByPlatform(), [])
  const canRemove = actions.length > 1

  const addFromPreset = (presetId: string | null) => {
    if (!presetId || !getPreset(presetId)) return
    setActions((prev) => [...prev, { id: uid(), presetId, value: '' }])
    // remount select so it clears after picking
    setPickerKey((k) => k + 1)
  }

  const removeAction = (id: string) => {
    setActions((prev) =>
      prev.length <= 1 ? prev : prev.filter((a) => a.id !== id),
    )
  }

  const updateValue = (id: string, value: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, value } : a)),
    )
  }

  return el(
    Theme,
    {
      appearance: 'dark',
      grayColor: 'slate',
      accentColor: 'blue',
      className: 'gated-theme',
    },
    el(
      'div',
      { className: 'gated-shell' },
      // LEFT — scrolls
      el(
        'main',
        { className: 'gated-form' },
        el(
          'div',
          { className: 'gated-form__inner' },
          el(
            'div',
            { className: 'gated-brand-row' },
            el(Text, { size: '4', weight: 'bold', className: 'gated-logo' }, '[gated]'),
            el(
              Badge,
              { size: '1', variant: 'soft', color: 'amber' },
              'Beta',
            ),
          ),
          el(
            Heading,
            { as: 'h1', size: '8', weight: 'bold', className: 'gated-title' },
            'Welcome',
          ),
          el(
            Text,
            { size: '2', color: 'gray', className: 'gated-lede' },
            'Pick social unlock steps. Preview stays fixed on the right.',
          ),

          el(
            'div',
            { className: 'gated-form__body' },
            ...actions.map((action, index) => {
              const preset = getPreset(action.presetId)
              if (!preset) return null
              const Icon = PLATFORM_ICONS[preset.platformId]
              return el(
                'div',
                { key: action.id, className: 'gated-item' },
                el(
                  'div',
                  { className: 'gated-item__bar' },
                  el(
                    'div',
                    { className: 'gated-item__meta' },
                    el(Icon, { className: 'gated-item__platform-icon' }),
                    el(
                      'div',
                      { className: 'gated-item__titles' },
                      el(
                        Text,
                        { size: '1', color: 'gray' },
                        `${preset.platform} · Step ${index + 1}`,
                      ),
                      el(Text, { size: '2', weight: 'medium' }, preset.label),
                    ),
                  ),
                  el(
                    IconButton,
                    {
                      size: '1',
                      variant: 'ghost',
                      color: 'gray',
                      disabled: !canRemove,
                      'aria-label': `Remove ${preset.label}`,
                      onClick: () => removeAction(action.id),
                    },
                    el(Trash16, null),
                  ),
                ),
                el(
                  TextField.Root,
                  { size: '3', variant: 'surface', className: 'gated-input' },
                  preset.prefix
                    ? el(
                        TextField.Slot,
                        null,
                        el(Text, { size: '2', color: 'gray' }, preset.prefix),
                      )
                    : null,
                  el(TextField.Input, {
                    value: action.value,
                    placeholder: preset.placeholder,
                    inputMode: preset.inputKind === 'url' ? 'url' : 'text',
                    onChange: (e: { target: { value: string } }) =>
                      updateValue(action.id, e.target.value),
                  }),
                ),
              )
            }),

            el(
              'div',
              { key: `picker-${pickerKey}`, className: 'gated-picker' },
              el(
                Text,
                { size: '1', weight: 'medium', color: 'gray' },
                'Add social action',
              ),
              el(
                Select.Root,
                {
                  onValueChange: (value: string) => addFromPreset(value),
                },
                el(Select.Trigger, {
                  placeholder: 'Choose platform action…',
                  className: 'gated-picker__trigger',
                }),
                el(
                  Select.Content,
                  { position: 'popper' },
                  ...groups.flatMap(([platform, presets]) => [
                    el(
                      Select.Group,
                      { key: platform },
                      el(Select.GroupLabel, null, platform),
                      ...presets.map((preset) =>
                        el(
                          Select.Item,
                          { key: preset.id, value: preset.id },
                          preset.label,
                        ),
                      ),
                    ),
                  ]),
                ),
              ),
            ),
          ),
        ),

        el(
          'div',
          { className: 'gated-form__footer' },
          el(Text, { size: '1', color: 'gray' }, 'Design only — auth later'),
        ),
      ),

      // RIGHT — fixed size, no page scroll, panel centered
      el(
        'aside',
        { className: 'gated-embed', 'aria-label': 'Locker preview' },
        el(
          'div',
          {
            className: 'gated-embed__panel',
            style: { backgroundImage: PANEL_CANVAS },
          },
          el(
            'div',
            { className: 'gated-embed__content' },
            el(
              'div',
              { className: 'gated-embed__hero' },
              el('div', { className: 'gated-embed__icon' }, el(Lock20, null)),
              el(
                Heading,
                {
                  as: 'h2',
                  size: '6',
                  weight: 'bold',
                  align: 'center',
                  highContrast: true,
                },
                'Content locked',
              ),
              el(
                Text,
                { size: '2', align: 'center', className: 'gated-embed__copy' },
                'Complete a step below to unlock.',
              ),
            ),
            el(
              'div',
              { className: 'gated-embed__actions' },
              ...actions.map((action) => {
                const preset = getPreset(action.presetId)
                if (!preset) return null
                return el(BrandButton, {
                  key: action.id,
                  preset,
                  onClick: () => {
                    const href = resolveDestination(preset, action.value)
                    if (!href) return
                    window.open(href, '_blank', 'noopener,noreferrer')
                  },
                })
              }),
            ),
          ),
        ),
      ),
    ),
  )
}

export default ContentLockerHome
