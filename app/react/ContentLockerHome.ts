import {
  createElement,
  useMemo,
  useRef,
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
  Table,
  Tooltip,
  Toaster,
  toast,
  DateRangePicker,
  today,
  getLocalTimeZone,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  RechartsTooltip,
  Plus20,
  TrashFilled20,
  CopyBoldFilled20,
  EditBold20,
  DashboardBarGraphBoldFilled20,
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
  type ReactElement,
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
  active: boolean
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

function seriesForRange(
  base: DayStat[],
  range: { start: { add: (v: { days: number }) => any; compare: (other: any) => number }; end: unknown } | null,
): DayStat[] {
  if (!range?.start || !range?.end || !base.length) return base
  const tz = getLocalTimeZone()
  const out: DayStat[] = []
  let cursor: any = range.start
  let i = 0
  while (cursor.compare(range.end) <= 0 && i < 62) {
    const src = base[i % base.length]
    const label = cursor
      .toDate(tz)
      .toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    out.push({
      label,
      views: src.views,
      clicks: src.clicks,
    })
    cursor = cursor.add({ days: 1 })
    i += 1
  }
  return out.length ? out : base
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

function niceMax(value: number) {
  if (value <= 0) return 1
  const exp = Math.pow(10, Math.floor(Math.log10(value)))
  const n = value / exp
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return nice * exp
}

function ViewsClicksChart({
  series,
  chartKey,
}: {
  series: DayStat[]
  chartKey: string
}) {
  const maxVal = niceMax(Math.max(...series.map((d) => Math.max(d.views, d.clicks)), 1))

  return el(
    'div',
    { className: 'gated-chart-frame', key: chartKey },
    el(
      ResponsiveContainer,
      { width: '100%', height: 228 },
      el(
        ComposedChart,
        {
          data: series,
          margin: { top: 10, right: 8, left: 0, bottom: 4 },
        },
        el(
          'defs',
          null,
          el(
            'linearGradient',
            { id: `gatedViewsFill-${chartKey}`, x1: '0', y1: '0', x2: '0', y2: '1' },
            el('stop', {
              offset: '0%',
              stopColor: '#3b82f6',
              stopOpacity: 0.38,
            }),
            el('stop', {
              offset: '100%',
              stopColor: '#3b82f6',
              stopOpacity: 0,
            }),
          ),
        ),
        el(CartesianGrid, {
          stroke: 'rgba(255,255,255,0.07)',
          vertical: false,
          strokeDasharray: '0',
        }),
        el(XAxis, {
          dataKey: 'label',
          axisLine: false,
          tickLine: false,
          tick: { fill: 'rgba(255,255,255,0.42)', fontSize: 11 },
          dy: 8,
          minTickGap: 18,
        }),
        el(YAxis, {
          orientation: 'right',
          axisLine: false,
          tickLine: false,
          domain: [0, maxVal],
          width: 36,
          tick: { fill: 'rgba(255,255,255,0.42)', fontSize: 11 },
        }),
        el(RechartsTooltip, {
          cursor: { stroke: 'rgba(255,255,255,0.12)' },
          contentStyle: {
            background: '#111318',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
            color: '#fff',
            fontSize: 12,
          },
          labelStyle: { color: 'rgba(255,255,255,0.55)' },
        }),
        el(Area, {
          type: 'monotone',
          dataKey: 'views',
          name: 'Views',
          stroke: '#3b82f6',
          fill: `url(#gatedViewsFill-${chartKey})`,
          strokeWidth: 2.25,
          animationDuration: 850,
          animationEasing: 'ease-out',
          isAnimationActive: true,
        }),
        el(Line, {
          type: 'monotone',
          dataKey: 'clicks',
          name: 'Clicks',
          stroke: '#34d399',
          strokeWidth: 2.25,
          dot: false,
          activeDot: { r: 4, strokeWidth: 0 },
          animationDuration: 850,
          animationEasing: 'ease-out',
          isAnimationActive: true,
        }),
      ),
    ),
  )
}

function ActionTip({
  label,
  children,
}: {
  label: string
  children: ReactElement
}) {
  return el(Tooltip, { content: label, side: 'top', delay: 180 }, children)
}

function StatusBadge({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: () => void
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return el(
    'button',
    {
      type: 'button',
      className: active
        ? 'gated-status-btn gated-status-btn--active'
        : 'gated-status-btn gated-status-btn--inactive',
      'aria-label': active ? 'Active status' : 'Inactive status',
      onClick: (e: { preventDefault: () => void; stopPropagation: () => void }) => {
        e.preventDefault()
        e.stopPropagation()
        if (timerRef.current) return
        timerRef.current = setTimeout(() => {
          timerRef.current = null
          toast.warning(
            active
              ? 'Double-click to set this locker Inactive'
              : 'Double-click to set this locker Active',
          )
        }, 260)
      },
      onDoubleClick: (e: { preventDefault: () => void; stopPropagation: () => void }) => {
        e.preventDefault()
        e.stopPropagation()
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        onToggle()
        toast.success(
          active ? 'Locker set to Inactive' : 'Locker set to Active',
        )
      },
    },
    el(
      Badge,
      {
        size: '1',
        variant: 'soft',
        color: active ? 'green' : 'gray',
      },
      active ? 'Active' : 'Inactive',
    ),
  )
}

function InsightsPanel({
  link,
  onCopy,
  onEdit,
  onDelete,
}: {
  link: VaultLink
  onCopy: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const tz = getLocalTimeZone()
  const [range, setRange] = useState(() => {
    const end = today(tz)
    return { start: end.subtract({ days: 6 }), end }
  })

  const chartSeries = useMemo(
    () => seriesForRange(link.series, range),
    [link.series, range],
  )
  const chartKey = range
    ? `${range.start.toString()}_${range.end.toString()}`
    : 'default'

  return el(
    'div',
    { className: 'gated-detail' },
    el(
      'div',
      { className: 'gated-detail__head' },
      el(
        'a',
        {
          className: 'gated-detail__url',
          href: `https://gated.to/${link.slug}`,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        `gated.to/${link.slug}`,
      ),
      el(
        Heading,
        { as: 'h2', size: '6', weight: 'bold', highContrast: true },
        link.title,
      ),
      el(
        Text,
        { size: '2', color: 'gray', className: 'gated-detail__desc' },
        link.description,
      ),
    ),
    el(
      'div',
      { className: 'gated-detail__stats' },
      el(
        'div',
        { className: 'gated-stat' },
        el(
          'div',
          { className: 'gated-stat__top' },
          el(Text, { size: '1', color: 'gray' }, 'Views'),
          el(EyeFilled20, { className: 'gated-stat__icon' }),
        ),
        el(Text, { size: '5', weight: 'bold' }, String(link.views)),
      ),
      el(
        'div',
        { className: 'gated-stat' },
        el(
          'div',
          { className: 'gated-stat__top' },
          el(Text, { size: '1', color: 'gray' }, 'Clicks'),
          el(DashboardBarGraphBoldFilled20, { className: 'gated-stat__icon' }),
        ),
        el(Text, { size: '5', weight: 'bold' }, String(link.clicks)),
      ),
      el(
        'div',
        { className: 'gated-stat' },
        el(
          'div',
          { className: 'gated-stat__top' },
          el(Text, { size: '1', color: 'gray' }, 'Unlocks'),
          el(LockFilled20, { className: 'gated-stat__icon' }),
        ),
        el(Text, { size: '5', weight: 'bold' }, String(link.unlocks)),
      ),
    ),
    el(
      'div',
      { className: 'gated-detail__chart-wrap' },
      el(
        'div',
        { className: 'gated-detail__chart-head' },
        el(
          'div',
          { className: 'gated-detail__chart-titles' },
          el(Text, { size: '2', weight: 'medium' }, 'Views & clicks'),
          el(
            'div',
            { className: 'gated-chart-legend' },
            el(
              'span',
              {
                className:
                  'gated-chart-legend__item gated-chart-legend__item--views',
              },
              'Views',
            ),
            el(
              'span',
              {
                className:
                  'gated-chart-legend__item gated-chart-legend__item--clicks',
              },
              'Clicks',
            ),
          ),
        ),
        el(DateRangePicker, {
          size: '1',
          value: range,
          onChange: (next: typeof range | null) => {
            if (next?.start && next?.end) setRange(next)
          },
        }),
      ),
      el(ViewsClicksChart, { series: chartSeries, chartKey }),
    ),
    el(
      'div',
      { className: 'gated-detail__actions' },
      el(
        ActionTip,
        { label: 'Copy config' },
        el(
          IconButton,
          {
            size: '3',
            variant: 'soft',
            color: 'gray',
            highContrast: true,
            'aria-label': 'Copy config',
            onClick: onCopy,
          },
          el(CopyBoldFilled20, null),
        ),
      ),
      el(
        ActionTip,
        { label: 'Edit' },
        el(
          IconButton,
          {
            size: '3',
            variant: 'soft',
            color: 'gray',
            'aria-label': 'Edit',
            onClick: onEdit,
          },
          el(EditBold20, null),
        ),
      ),
      el(
        ActionTip,
        { label: 'Delete' },
        el(
          IconButton,
          {
            size: '3',
            variant: 'soft',
            color: 'red',
            'aria-label': 'Delete',
            onClick: onDelete,
          },
          el(TrashFilled20, null),
        ),
      ),
    ),
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
    setCreateFlash('')
    // Edit stays in Vault; copy opens a fresh Home draft.
    setNav(mode === 'edit' ? 'vault' : 'home')
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
      setEditingId(null)
      setCreateFlash('Link updated')
      setNav('vault')
    } else {
      const series = makeSeries()
      const views = series.reduce((sum, d) => sum + d.views, 0)
      const clicks = series.reduce((sum, d) => sum + d.clicks, 0)
      const link: VaultLink = {
        id: uid('lnk'),
        ...payload,
        createdAt: Date.now(),
        active: true,
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

  const toggleVaultActive = (id: string) => {
    setVault((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    )
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
              el(TrashFilled20, null),
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
                  setNav('home')
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
        ? 'Your created lockers.'
        : 'No links yet — create one from Home.',
    ),
    vault.length
      ? el(
          Table.Root,
          { size: '2', variant: 'ghost', className: 'gated-vault-table' },
          el(
            Table.Table,
            null,
            el(
              Table.Header,
              null,
              el(
                Table.Row,
                null,
                el(Table.ColumnHeaderCell, null, 'Name'),
                el(Table.ColumnHeaderCell, null, 'URL'),
                el(Table.ColumnHeaderCell, null, 'Status'),
                el(Table.ColumnHeaderCell, { justify: 'end' }, 'Views'),
                el(Table.ColumnHeaderCell, { justify: 'end' }, 'Clicks'),
                el(Table.ColumnHeaderCell, { justify: 'end' }, 'Steps'),
                el(Table.ColumnHeaderCell, { justify: 'end' }, 'Actions'),
              ),
            ),
            el(
              Table.Body,
              null,
              ...vault.map((link) =>
                el(
                  Table.Row,
                  {
                    key: link.id,
                    align: 'center',
                    className:
                      selectedVaultId === link.id
                        ? 'gated-vault-row gated-vault-row--active'
                        : 'gated-vault-row',
                  },
                  el(
                    Table.RowHeaderCell,
                    null,
                    el(
                      'button',
                      {
                        type: 'button',
                        className: 'gated-vault-name',
                        onClick: () => setSelectedVaultId(link.id),
                      },
                      link.title,
                    ),
                  ),
                  el(
                    Table.Cell,
                    null,
                    el(
                      'span',
                      { className: 'gated-vault-url' },
                      el(
                        'a',
                        {
                          className: 'gated-vault-url-link',
                          href: `https://gated.to/${link.slug}`,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        `gated.to/${link.slug}`,
                      ),
                      el(
                        ActionTip,
                        { label: 'Copy link' },
                        el(
                          IconButton,
                          {
                            size: '1',
                            variant: 'ghost',
                            color: 'gray',
                            'aria-label': `Copy gated.to/${link.slug}`,
                            onClick: (e: { stopPropagation: () => void }) => {
                              e.stopPropagation()
                              void navigator.clipboard?.writeText(
                                `https://gated.to/${link.slug}`,
                              )
                              toast.success('Link copied')
                            },
                          },
                          el(CopyBoldFilled20, null),
                        ),
                      ),
                    ),
                  ),
                  el(
                    Table.Cell,
                    null,
                    el(StatusBadge, {
                      active: link.active,
                      onToggle: () => toggleVaultActive(link.id),
                    }),
                  ),
                  el(Table.Cell, { justify: 'end' }, String(link.views)),
                  el(Table.Cell, { justify: 'end' }, String(link.clicks)),
                  el(
                    Table.Cell,
                    { justify: 'end' },
                    String(link.actions.length),
                  ),
                  el(
                    Table.Cell,
                    { justify: 'end' },
                    el(
                      'div',
                      { className: 'gated-vault-entry__actions' },
                      el(
                        ActionTip,
                        { label: 'Stats' },
                        el(
                          IconButton,
                          {
                            size: '2',
                            variant:
                              selectedVaultId === link.id ? 'soft' : 'ghost',
                            color: 'gray',
                            'aria-label': `View stats for ${link.title}`,
                            onClick: () => setSelectedVaultId(link.id),
                          },
                          el(DashboardBarGraphBoldFilled20, null),
                        ),
                      ),
                      el(
                        ActionTip,
                        { label: 'Edit' },
                        el(
                          IconButton,
                          {
                            size: '2',
                            variant: 'ghost',
                            color: 'gray',
                            'aria-label': `Edit ${link.title}`,
                            onClick: () => loadIntoEditor(link, 'edit'),
                          },
                          el(EditBold20, null),
                        ),
                      ),
                      el(
                        ActionTip,
                        { label: 'Delete' },
                        el(
                          IconButton,
                          {
                            size: '2',
                            variant: 'ghost',
                            color: 'red',
                            'aria-label': `Delete ${link.title}`,
                            onClick: () => deleteVaultLink(link.id),
                          },
                          el(TrashFilled20, null),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        )
      : null,
  )

  const showEditor = nav === 'home' || Boolean(editingId)
  const navHighlight: NavId = editingId ? 'vault' : nav

  const pageContent = editingId
    ? homeContent
    : nav === 'home'
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
    ? el(InsightsPanel, {
        key: selectedVault.id,
        link: selectedVault,
        onCopy: () => loadIntoEditor(selectedVault, 'copy'),
        onEdit: () => loadIntoEditor(selectedVault, 'edit'),
        onDelete: () => deleteVaultLink(selectedVault.id),
      })
    : el(
        'div',
        { className: 'gated-detail gated-detail--empty' },
        el(DashboardBarGraphBoldFilled20, {
          className: 'gated-detail__empty-icon',
        }),
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
    el(Toaster, { position: 'bottom-right', timeout: 4200 }),
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
                  active: navHighlight === item.id,
                  onClick: () => {
                    if (editingId && item.id !== 'vault') {
                      setEditingId(null)
                      setCreateFlash('')
                    }
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
            !showEditor && nav === 'vault'
              ? 'Link insights'
              : 'Locker preview',
        },
        !showEditor && nav === 'vault' ? vaultDetailPanel : previewPanel,
      ),
    ),
  )
}

export default ContentLockerHome
