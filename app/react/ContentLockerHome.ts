import {
  createElement,
  useMemo,
  useState,
  Theme,
  Heading,
  Text,
  Badge,
  Button,
  IconButton,
  TextField,
  TextArea,
  Select,
  Trash16,
  Plus20,
  CopyFilled20,
  Pencil20,
  Stats20,
  EyeFilled20,
  LockFilled20,
  LinkFilled20,
  ArrowRightFilled20,
  HomeFilled20,
  MoneyReceiptFilled20,
  GearFilled20,
  YoutubeFilled20,
  InstagramFilled20,
  XDotComFilled20,
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

type NavId = 'home' | 'vault' | 'payouts' | 'settings'

type DayStat = { label: string; views: number; clicks: number }

type VaultLink = {
  id: string
  slug: string
  title: string
  description: string
  destinationLabel: string
  destinationUrl: string
  actions: LockerAction[]
  createdAt: number
  views: number
  clicks: number
  unlocks: number
  series: DayStat[]
}

const NAV_ITEMS: {
  id: NavId
  label: string
  Icon: ComponentType<{ className?: string }>
}[] = [
  { id: 'home', label: 'Home', Icon: HomeFilled20 },
  { id: 'vault', label: 'Vault', Icon: LockFilled20 },
  { id: 'payouts', label: 'Payouts', Icon: MoneyReceiptFilled20 },
  { id: 'settings', label: 'Settings', Icon: GearFilled20 },
]

const PLATFORM_ICONS: Record<
  PlatformId,
  ComponentType<{ className?: string; style?: Record<string, string> }>
> = {
  youtube: YoutubeFilled20,
  instagram: InstagramFilled20,
  x: XDotComFilled20,
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

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function cloneActions(actions: LockerAction[]): LockerAction[] {
  return actions.map((a) => ({ ...a, id: uid('act') }))
}

function makeSeries(): DayStat[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((label, i) => {
    const views = 40 + ((i * 37 + 11) % 90)
    const clicks = Math.max(4, Math.round(views * (0.18 + (i % 4) * 0.04)))
    return { label, views, clicks }
  })
}

function freshActions(): LockerAction[] {
  return [
    { id: uid('act'), presetId: 'youtube:subscribe', value: '' },
    { id: uid('act'), presetId: 'discord:join', value: '' },
  ]
}

const DESTINATION_LABELS = [
  'Continue',
  'Buy now',
  'Get access',
  'Unlock',
  'Unlock content',
  'Claim reward',
  'Claim now',
  'Download',
  'Join now',
  'View content',
  'Get started',
  'Open link',
  'Access now',
  'Enter',
  'Proceed',
  'Redeem',
  'Get exclusive access',
  'Watch now',
  'Listen now',
  'Start free',
  'Upgrade',
  'Subscribe',
] as const

const PANEL_CANVAS =
  'radial-gradient(120% 80% at 50% 0%, #3b82f6 0%, #1e3a8a 34%, #0b1224 70%, #070a12 100%)'

function normalizeUrl(input: string): string {
  const v = input.trim()
  if (!v) return ''
  return v.startsWith('http://') || v.startsWith('https://') ? v : `https://${v}`
}

function platformAccent(preset: SocialPreset) {
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

function NavButton({
  label,
  Icon,
  active,
  onClick,
}: {
  label: string
  Icon: ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}) {
  return el(
    'button',
    {
      type: 'button',
      className: active ? 'gated-nav-btn gated-nav-btn--active' : 'gated-nav-btn',
      'aria-current': active ? 'page' : undefined,
      onClick,
    },
    el(Icon, { className: 'gated-nav-btn__icon' }),
    el('span', { className: 'gated-nav-btn__label' }, label),
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

function ViewsClicksChart({ series }: { series: DayStat[] }) {
  const max = Math.max(...series.map((d) => d.views), 1)
  const w = 320
  const h = 140
  const pad = 18
  const gap = 10
  const barW = (w - pad * 2 - gap * (series.length - 1)) / series.length

  return el(
    'svg',
    {
      className: 'gated-chart',
      viewBox: `0 0 ${w} ${h}`,
      role: 'img',
      'aria-label': 'Views and clicks over the last 7 days',
    },
    ...series.flatMap((d, i) => {
      const x = pad + i * (barW + gap)
      const viewsH = Math.max(4, (d.views / max) * (h - 36))
      const clicksH = Math.max(3, (d.clicks / max) * (h - 36))
      return [
        el('rect', {
          key: `${d.label}-v`,
          x,
          y: h - 22 - viewsH,
          width: barW * 0.55,
          height: viewsH,
          rx: 3,
          className: 'gated-chart__views',
        }),
        el('rect', {
          key: `${d.label}-c`,
          x: x + barW * 0.45,
          y: h - 22 - clicksH,
          width: barW * 0.55,
          height: clicksH,
          rx: 3,
          className: 'gated-chart__clicks',
        }),
        el(
          'text',
          {
            key: `${d.label}-t`,
            x: x + barW / 2,
            y: h - 6,
            textAnchor: 'middle',
            className: 'gated-chart__label',
          },
          d.label,
        ),
      ]
    }),
  )
}

export function ContentLockerHome() {
  const [nav, setNav] = useState<NavId>('home')
  const [slug, setSlug] = useState('my-drop')
  const [title, setTitle] = useState('Content locked')
  const [description, setDescription] = useState(
    'Complete a step below to unlock.',
  )
  const [destinationLabel, setDestinationLabel] = useState<string>('Continue')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [actions, setActions] = useState<LockerAction[]>(freshActions)
  const [pickerKey, setPickerKey] = useState(0)
  const [vault, setVault] = useState<VaultLink[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null)
  const [createFlash, setCreateFlash] = useState('')

  const groups = useMemo(() => presetsByPlatform(), [])
  const canRemove = actions.length > 1
  const selectedVault = vault.find((v) => v.id === selectedVaultId) ?? null

  const addFromPreset = (presetId: string | null) => {
    if (!presetId || !getPreset(presetId)) return
    setActions((prev) => [...prev, { id: uid('act'), presetId, value: '' }])
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
  const previewDestinationLabel = destinationLabel || 'Continue'
  const previewDestinationHref = normalizeUrl(destinationUrl)

  const loadIntoEditor = (link: VaultLink, mode: 'edit' | 'copy') => {
    setSlug(mode === 'copy' ? `${link.slug}-copy` : link.slug)
    setTitle(mode === 'copy' ? `${link.title} (copy)` : link.title)
    setDescription(link.description)
    setDestinationLabel(link.destinationLabel)
    setDestinationUrl(link.destinationUrl)
    setActions(cloneActions(link.actions))
    setSlugTouched(true)
    setEditingId(mode === 'edit' ? link.id : null)
    setSelectedVaultId(null)
    setNav('home')
    setCreateFlash('')
  }

  const createOrUpdateLink = () => {
    const nextSlug = previewSlug
    const payload = {
      slug: nextSlug,
      title: previewTitle,
      description: previewDescription,
      destinationLabel: previewDestinationLabel,
      destinationUrl: destinationUrl.trim(),
      actions: cloneActions(actions),
    }

    if (editingId) {
      setVault((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...payload } : item,
        ),
      )
      setSelectedVaultId(editingId)
      setCreateFlash('Link updated')
    } else {
      const series = makeSeries()
      const views = series.reduce((sum, d) => sum + d.views, 0)
      const clicks = series.reduce((sum, d) => sum + d.clicks, 0)
      const link: VaultLink = {
        id: uid('lnk'),
        ...payload,
        createdAt: Date.now(),
        views,
        clicks,
        unlocks: Math.max(1, Math.round(clicks * 0.62)),
        series,
      }
      setVault((prev) => [link, ...prev])
      setSelectedVaultId(link.id)
      setCreateFlash('Added to Vault')
    }

    setNav('vault')
  }

  const deleteVaultLink = (id: string) => {
    setVault((prev) => prev.filter((item) => item.id !== id))
    if (selectedVaultId === id) setSelectedVaultId(null)
    if (editingId === id) setEditingId(null)
  }

  const homeContent = el(
    'div',
    { className: 'gated-home' },
    el(
      Heading,
      { as: 'h1', size: '8', weight: 'bold', className: 'gated-title' },
      editingId ? 'Edit link' : 'Welcome',
    ),
    el(
      Text,
      { size: '2', color: 'gray', className: 'gated-lede' },
      editingId
        ? 'Update this locker, then save changes back to Vault.'
        : 'Set your locker details and social unlock steps.',
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
          Select.Root,
          {
            value: destinationLabel,
            onValueChange: (value: string) => setDestinationLabel(value),
          },
          el(Select.Trigger, {
            placeholder: 'Choose button text…',
            className: 'gated-picker__trigger',
          }),
          el(
            Select.Content,
            { position: 'popper', className: 'gated-select-content' },
            ...DESTINATION_LABELS.map((label) =>
              el(Select.Item, { key: label, value: label }, label),
            ),
          ),
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
        { size: '2', weight: 'medium', className: 'gated-section-label' },
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
            { position: 'popper', className: 'gated-select-content' },
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
      el(
        'div',
        { className: 'gated-create-row' },
        el(
          Button,
          {
            size: '3',
            highContrast: true,
            className: 'gated-create-btn',
            onClick: createOrUpdateLink,
          },
          el(Plus20, null),
          editingId ? 'Save changes' : 'Create link',
        ),
        editingId
          ? el(
              Button,
              {
                size: '3',
                variant: 'soft',
                color: 'gray',
                onClick: () => {
                  setEditingId(null)
                  setCreateFlash('')
                },
              },
              'Cancel edit',
            )
          : null,
      ),
      createFlash
        ? el(Text, { size: '1', color: 'gray' }, createFlash)
        : null,
    ),
  )

  const vaultContent = el(
    'div',
    { className: 'gated-vault' },
    el(
      Heading,
      { as: 'h1', size: '7', weight: 'bold', className: 'gated-title' },
      'Vault',
    ),
    el(
      Text,
      { size: '2', color: 'gray', className: 'gated-lede' },
      vault.length
        ? 'Your created lockers. Open stats, edit, or delete.'
        : 'No links yet — create one from Home.',
    ),
    vault.length
      ? el(
          'div',
          { className: 'gated-vault__list' },
          ...vault.map((link) =>
            el(
              'div',
              {
                key: link.id,
                className:
                  selectedVaultId === link.id
                    ? 'gated-vault-item gated-vault-item--active'
                    : 'gated-vault-item',
              },
              el(
                'div',
                { className: 'gated-vault-item__main' },
                el(
                  'div',
                  { className: 'gated-vault-item__copy' },
                  el(Text, { size: '2', weight: 'medium' }, link.title),
                  el(
                    Text,
                    { size: '1', color: 'gray' },
                    `gated.to/${link.slug}`,
                  ),
                  el(
                    Text,
                    { size: '1', color: 'gray', className: 'gated-vault-item__meta' },
                    `${link.views} views · ${link.clicks} clicks · ${link.actions.length} steps`,
                  ),
                ),
                el(
                  'div',
                  { className: 'gated-vault-item__actions' },
                  el(
                    IconButton,
                    {
                      size: '2',
                      variant: selectedVaultId === link.id ? 'solid' : 'soft',
                      color: 'blue',
                      'aria-label': `View stats for ${link.title}`,
                      onClick: () => setSelectedVaultId(link.id),
                    },
                    el(Stats20, null),
                  ),
                  el(
                    IconButton,
                    {
                      size: '2',
                      variant: 'soft',
                      color: 'gray',
                      'aria-label': `Edit ${link.title}`,
                      onClick: () => loadIntoEditor(link, 'edit'),
                    },
                    el(Pencil20, null),
                  ),
                  el(
                    IconButton,
                    {
                      size: '2',
                      variant: 'soft',
                      color: 'red',
                      'aria-label': `Delete ${link.title}`,
                      onClick: () => deleteVaultLink(link.id),
                    },
                    el(Trash16, null),
                  ),
                ),
              ),
            ),
          ),
        )
      : null,
  )

  const pageContent =
    nav === 'home'
      ? homeContent
      : nav === 'vault'
        ? vaultContent
        : nav === 'payouts'
          ? el(PlaceholderPanel, {
              title: 'Payouts',
              copy: 'Earnings and payout settings will land here.',
            })
          : el(PlaceholderPanel, {
              title: 'Settings',
              copy: 'Account and workspace settings will land here.',
            })

  const previewPanel = el(
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
        el('div', { className: 'gated-embed__icon' }, el(LockFilled20, null)),
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
  )

  const vaultDetailPanel = selectedVault
    ? el(
        'div',
        { className: 'gated-detail' },
        el(
          'div',
          { className: 'gated-detail__head' },
          el(
            Text,
            { size: '1', color: 'gray' },
            `gated.to/${selectedVault.slug}`,
          ),
          el(
            Heading,
            { as: 'h2', size: '6', weight: 'bold', highContrast: true },
            selectedVault.title,
          ),
          el(
            Text,
            { size: '2', color: 'gray', className: 'gated-detail__desc' },
            selectedVault.description,
          ),
        ),
        el(
          'div',
          { className: 'gated-detail__stats' },
          el(
            'div',
            { className: 'gated-stat' },
            el(EyeFilled20, { className: 'gated-stat__icon' }),
            el('div', null,
              el(Text, { size: '1', color: 'gray' }, 'Views'),
              el(Text, { size: '5', weight: 'bold' }, String(selectedVault.views)),
            ),
          ),
          el(
            'div',
            { className: 'gated-stat' },
            el(Stats20, { className: 'gated-stat__icon' }),
            el('div', null,
              el(Text, { size: '1', color: 'gray' }, 'Clicks'),
              el(Text, { size: '5', weight: 'bold' }, String(selectedVault.clicks)),
            ),
          ),
          el(
            'div',
            { className: 'gated-stat' },
            el(LockFilled20, { className: 'gated-stat__icon' }),
            el('div', null,
              el(Text, { size: '1', color: 'gray' }, 'Unlocks'),
              el(Text, { size: '5', weight: 'bold' }, String(selectedVault.unlocks)),
            ),
          ),
        ),
        el(
          'div',
          { className: 'gated-detail__chart-wrap' },
          el(
            Text,
            { size: '2', weight: 'medium' },
            'Views & clicks · last 7 days',
          ),
          el(
            'div',
            { className: 'gated-chart-legend' },
            el('span', { className: 'gated-chart-legend__item gated-chart-legend__item--views' }, 'Views'),
            el('span', { className: 'gated-chart-legend__item gated-chart-legend__item--clicks' }, 'Clicks'),
          ),
          el(ViewsClicksChart, { series: selectedVault.series }),
        ),
        el(
          'div',
          { className: 'gated-detail__info' },
          el(Text, { size: '1', color: 'gray' }, 'Destination'),
          el(
            Text,
            { size: '2' },
            `${selectedVault.destinationLabel} → ${
              selectedVault.destinationUrl.trim() || 'No URL set'
            }`,
          ),
          el(Text, { size: '1', color: 'gray', className: 'gated-detail__steps-label' }, 'Unlock steps'),
          ...selectedVault.actions.map((action, index) => {
            const preset = getPreset(action.presetId)
            if (!preset) return null
            return el(
              Text,
              { key: action.id, size: '2' },
              `${index + 1}. ${preset.platform} — ${preset.label}${
                action.value.trim() ? ` (@${action.value.replace(/^@/, '')})` : ''
              }`,
            )
          }),
        ),
        el(
          'div',
          { className: 'gated-detail__actions' },
          el(
            Button,
            {
              size: '3',
              highContrast: true,
              onClick: () => loadIntoEditor(selectedVault, 'copy'),
            },
            el(CopyFilled20, null),
            'Copy config',
          ),
          el(
            Button,
            {
              size: '3',
              variant: 'soft',
              color: 'gray',
              onClick: () => loadIntoEditor(selectedVault, 'edit'),
            },
            el(Pencil20, null),
            'Edit',
          ),
          el(
            Button,
            {
              size: '3',
              variant: 'soft',
              color: 'red',
              onClick: () => deleteVaultLink(selectedVault.id),
            },
            el(Trash16, null),
            'Delete',
          ),
        ),
      )
    : el(
        'div',
        { className: 'gated-detail gated-detail--empty' },
        el(Stats20, { className: 'gated-detail__empty-icon' }),
        el(
          Heading,
          { as: 'h2', size: '5', weight: 'bold', highContrast: true },
          'Link insights',
        ),
        el(
          Text,
          { size: '2', color: 'gray', align: 'center' },
          'Select a Vault link to see views, clicks, and config actions.',
        ),
      )

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
        'div',
        { className: 'gated-form-col' },
        el(
          'main',
          { className: 'gated-form' },
          el(
            'div',
            { className: 'gated-form__inner' },
            el(
              'nav',
              { className: 'gated-nav', 'aria-label': 'Primary' },
              ...NAV_ITEMS.map((item) =>
                el(NavButton, {
                  key: item.id,
                  label: item.label,
                  Icon: item.Icon,
                  active: nav === item.id,
                  onClick: () => {
                    setNav(item.id)
                    if (item.id !== 'vault') setSelectedVaultId(null)
                  },
                }),
              ),
            ),
            el(
              'div',
              { className: 'gated-brand-row' },
              el(
                Text,
                { size: '4', weight: 'bold', className: 'gated-logo' },
                '[gated]',
              ),
              el(Badge, { size: '1', variant: 'soft', color: 'amber' }, 'Beta'),
            ),
            pageContent,
          ),
        ),
        el('div', {
          className: 'gated-form__fade',
          'aria-hidden': true,
        }),
      ),

      el(
        'aside',
        {
          className: 'gated-embed',
          'aria-label':
            nav === 'vault' ? 'Link insights' : 'Locker preview',
        },
        nav === 'vault' ? vaultDetailPanel : previewPanel,
      ),
    ),
  )
}

export default ContentLockerHome
