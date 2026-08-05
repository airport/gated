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
  TextArea,
  Select,
  Tabs,
  Trash16,
  LockFilled20,
  LinkFilled20,
  ArrowRightFilled20,
  YoutubeFilled20,
  InstagramFilled20,
  TwitterFilled20,
  TiktokFilled20,
  DiscordFilled20,
  Twitch20,
  FacebookFilled20,
  TelegramFilled20,
  Linkedin20,
  type ReactNode,
  type ComponentType,
} from 'virtual:frosted-ui'
import {
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
  ComponentType<{ className?: string; style?: Record<string, string> }>
> = {
  youtube: YoutubeFilled20,
  instagram: InstagramFilled20,
  x: TwitterFilled20,
  tiktok: TiktokFilled20,
  discord: DiscordFilled20,
  twitch: Twitch20,
  facebook: FacebookFilled20,
  telegram: TelegramFilled20,
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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

const DEFAULT_ACTIONS: LockerAction[] = [
  { id: uid(), presetId: 'youtube:subscribe', value: '' },
  { id: uid(), presetId: 'discord:join', value: '' },
]

const PANEL_CANVAS =
  'radial-gradient(120% 80% at 50% 0%, #3b82f6 0%, #1e3a8a 34%, #0b1224 70%, #070a12 100%)'

function normalizeUrl(input: string): string {
  const v = input.trim()
  if (!v) return ''
  return v.startsWith('http://') || v.startsWith('https://') ? v : `https://${v}`
}

function platformAccent(preset: SocialPreset) {
  // Near-black brands need a light glyph on dark UI.
  return preset.brandText ?? preset.brand
}

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

function DestinationButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return el(
    'button',
    {
      type: 'button',
      className: 'gated-destination-btn',
      onClick,
    },
    el(ArrowRightFilled20, { className: 'gated-destination-btn__icon' }),
    el('span', null, label),
  )
}

function PlaceholderPanel({ title, copy }: { title: string; copy: string }) {
  return el(
    'div',
    { className: 'gated-placeholder' },
    el(
      Heading,
      { as: 'h1', size: '7', weight: 'bold', className: 'gated-title' },
      title,
    ),
    el(Text, { size: '2', color: 'gray', className: 'gated-lede' }, copy),
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return el(
    Text,
    { size: '1', weight: 'medium', color: 'gray', as: 'label' },
    children,
  )
}

export function ContentLockerHome() {
  const [slug, setSlug] = useState('my-drop')
  const [title, setTitle] = useState('Content locked')
  const [description, setDescription] = useState(
    'Complete a step below to unlock.',
  )
  const [destinationLabel, setDestinationLabel] = useState('Continue')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  const [actions, setActions] = useState<LockerAction[]>(DEFAULT_ACTIONS)
  const [pickerKey, setPickerKey] = useState(0)
  const groups = useMemo(() => presetsByPlatform(), [])
  const canRemove = actions.length > 1

  const addFromPreset = (presetId: string | null) => {
    if (!presetId || !getPreset(presetId)) return
    setActions((prev) => [...prev, { id: uid(), presetId, value: '' }])
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

  const onTitleChange = (value: string) => {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value) || 'locker')
  }

  const previewTitle = title.trim() || 'Content locked'
  const previewDescription =
    description.trim() || 'Complete a step below to unlock.'
  const previewSlug = slugify(slug) || 'locker'
  const previewDestinationLabel = destinationLabel.trim() || 'Continue'
  const previewDestinationHref = normalizeUrl(destinationUrl)

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
            el(Badge, { size: '1', variant: 'soft', color: 'amber' }, 'Beta'),
          ),
          el(
            Tabs.Root,
            {
              defaultValue: 'home',
              className: 'gated-tabs',
            },
            el(
              Tabs.List,
              { size: '2', className: 'gated-tabs__list' },
              el(Tabs.Trigger, { value: 'home' }, 'Home'),
              el(Tabs.Trigger, { value: 'vault' }, 'Vault'),
              el(Tabs.Trigger, { value: 'payouts' }, 'Payouts'),
              el(Tabs.Trigger, { value: 'settings' }, 'Settings'),
            ),
            el(
              Tabs.Content,
              { value: 'home', className: 'gated-tabs__panel', keepMounted: true },
              el(
                Heading,
                { as: 'h1', size: '8', weight: 'bold', className: 'gated-title' },
                'Welcome',
              ),
              el(
                Text,
                { size: '2', color: 'gray', className: 'gated-lede' },
                'Set your locker details and social unlock steps.',
              ),

              el(
                'div',
                { className: 'gated-meta' },
                el(
                  'div',
                  { className: 'gated-field' },
                  el(FieldLabel, null, 'Title'),
                  el(
                    TextField.Root,
                    { size: '3', variant: 'surface' },
                    el(TextField.Input, {
                      value: title,
                      placeholder: 'Content locked',
                      onChange: (e: { target: { value: string } }) =>
                        onTitleChange(e.target.value),
                    }),
                  ),
                ),
                el(
                  'div',
                  { className: 'gated-field' },
                  el(FieldLabel, null, 'Slug'),
                  el(
                    TextField.Root,
                    { size: '3', variant: 'surface' },
                    el(
                      TextField.Slot,
                      null,
                      el(Text, { size: '2', color: 'gray' }, '/'),
                    ),
                    el(TextField.Input, {
                      value: slug,
                      placeholder: 'my-drop',
                      onChange: (e: { target: { value: string } }) => {
                        setSlugTouched(true)
                        setSlug(e.target.value)
                      },
                      onBlur: () => setSlug(slugify(slug) || 'locker'),
                    }),
                  ),
                  el(
                    Text,
                    { size: '1', color: 'gray', className: 'gated-slug-hint' },
                    `gated.to/${previewSlug}`,
                  ),
                ),
                el(
                  'div',
                  { className: 'gated-field' },
                  el(FieldLabel, null, 'Description'),
                  el(TextArea, {
                    size: '3',
                    variant: 'surface',
                    value: description,
                    placeholder: 'Complete a step below to unlock.',
                    rows: 3,
                    resize: 'vertical',
                    onChange: (e: { target: { value: string } }) =>
                      setDescription(e.target.value),
                  }),
                ),
                el(
                  'div',
                  { className: 'gated-field' },
                  el(FieldLabel, null, 'Destination button'),
                  el(
                    TextField.Root,
                    { size: '3', variant: 'surface' },
                    el(TextField.Input, {
                      value: destinationLabel,
                      placeholder: 'Continue',
                      onChange: (e: { target: { value: string } }) =>
                        setDestinationLabel(e.target.value),
                    }),
                  ),
                  el(
                    TextField.Root,
                    { size: '3', variant: 'surface', className: 'gated-input' },
                    el(
                      TextField.Slot,
                      null,
                      el(LinkFilled20, { className: 'gated-field-icon' }),
                    ),
                    el(TextField.Input, {
                      value: destinationUrl,
                      placeholder: 'https://example.com/reward',
                      inputMode: 'url',
                      onChange: (e: { target: { value: string } }) =>
                        setDestinationUrl(e.target.value),
                    }),
                  ),
                  el(
                    Text,
                    { size: '1', color: 'gray', className: 'gated-slug-hint' },
                    'Shown after unlock steps — opens the reward URL.',
                  ),
                ),
              ),

              el(
                'div',
                { className: 'gated-form__body' },
                el(
                  Text,
                  {
                    size: '2',
                    weight: 'medium',
                    className: 'gated-section-label',
                  },
                  'Unlock steps',
                ),
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
                        el(Icon, {
                          className: 'gated-item__platform-icon',
                          style: { color: platformAccent(preset) },
                        }),
                        el(
                          'div',
                          { className: 'gated-item__titles' },
                          el(
                            Text,
                            { size: '1', color: 'gray' },
                            `${preset.platform} · Step ${index + 1}`,
                          ),
                          el(
                            Text,
                            { size: '2', weight: 'medium' },
                            preset.label,
                          ),
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
                      {
                        size: '3',
                        variant: 'surface',
                        className: 'gated-input',
                      },
                      preset.prefix
                        ? el(
                            TextField.Slot,
                            null,
                            el(
                              Text,
                              { size: '2', color: 'gray' },
                              preset.prefix,
                            ),
                          )
                        : null,
                      el(TextField.Input, {
                        value: action.value,
                        placeholder: preset.placeholder,
                        inputMode:
                          preset.inputKind === 'url' ? 'url' : 'text',
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
                      {
                        position: 'popper',
                        className: 'gated-select-content',
                      },
                      ...groups.flatMap(([platform, presets]) => [
                        el(
                          Select.Group,
                          { key: platform },
                          el(Select.GroupLabel, null, platform),
                          ...presets.map((preset) => {
                            const Icon = PLATFORM_ICONS[preset.platformId]
                            return el(
                              Select.Item,
                              { key: preset.id, value: preset.id },
                              el(
                                'span',
                                { className: 'gated-select-item' },
                                el(Icon, {
                                  className: 'gated-select-item__icon',
                                  style: { color: platformAccent(preset) },
                                }),
                                el('span', null, preset.label),
                              ),
                            )
                          }),
                        ),
                      ]),
                    ),
                  ),
                ),
              ),
            ),
            el(
              Tabs.Content,
              { value: 'vault', className: 'gated-tabs__panel' },
              el(PlaceholderPanel, {
                title: 'Vault',
                copy: 'Saved lockers and assets will land here.',
              }),
            ),
            el(
              Tabs.Content,
              { value: 'payouts', className: 'gated-tabs__panel' },
              el(PlaceholderPanel, {
                title: 'Payouts',
                copy: 'Earnings and payout settings will land here.',
              }),
            ),
            el(
              Tabs.Content,
              { value: 'settings', className: 'gated-tabs__panel' },
              el(PlaceholderPanel, {
                title: 'Settings',
                copy: 'Account and workspace settings will land here.',
              }),
            ),
          ),
        ),

        el(
          'div',
          { className: 'gated-form__footer' },
          el(Text, { size: '1', color: 'gray' }, 'Design only — auth later'),
        ),
      ),

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
              el(
                'div',
                { className: 'gated-embed__icon' },
                el(LockFilled20, null),
              ),
              el(
                Text,
                { size: '1', color: 'gray', className: 'gated-embed__slug' },
                `/${previewSlug}`,
              ),
              el(
                Heading,
                {
                  as: 'h2',
                  size: '6',
                  weight: 'bold',
                  align: 'center',
                  highContrast: true,
                },
                previewTitle,
              ),
              el(
                Text,
                { size: '2', align: 'center', className: 'gated-embed__copy' },
                previewDescription,
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
              el(DestinationButton, {
                key: 'destination',
                label: previewDestinationLabel,
                onClick: () => {
                  if (!previewDestinationHref) return
                  window.open(
                    previewDestinationHref,
                    '_blank',
                    'noopener,noreferrer',
                  )
                },
              }),
            ),
          ),
        ),
      ),
    ),
  )
}

export default ContentLockerHome
