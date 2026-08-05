declare module 'virtual:frosted-ui' {
  import type {
    ComponentType,
    ReactElement,
    ReactNode,
    Key,
  } from 'react'
  import type { Root } from 'react-dom/client'

  export {
    createElement,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    Fragment,
    Component,
    StrictMode,
    version,
  } from 'react'

  export { createRoot, hydrateRoot } from 'react-dom/client'

  export type { ComponentType, ReactElement, ReactNode, Key, Root }

  export {
    Theme,
    Heading,
    Text,
    Button,
    Badge,
    Card,
    IconButton,
    Link,
    Spinner,
    Skeleton,
    Separator,
    Avatar,
    Callout,
    Checkbox,
    Switch,
    TextField,
    TextArea,
    Dialog,
    Select,
    Tabs,
    Tooltip,
    DataList,
    Table,
    Code,
    Toaster,
    toast,
    DateRangePicker,
    frostedThemePlugin,
  } from 'frosted-ui'

  export {
    today,
    getLocalTimeZone,
    parseDate,
  } from '@internationalized/date'

  export {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
  } from 'recharts'

  export {
    Plus16,
    Plus20,
    Trash16,
    Trash20,
    TrashFilled20,
    Link16,
    Link20,
    LinkFilled20,
    ArrowRightFilled20,
    HomeFilled20,
    MoneyReceiptFilled20,
    GearFilled20,
    CopyFilled20,
    CopyBoldFilled20,
    Pencil20,
    EditBold20,
    Stats20,
    DashboardBarGraphBoldFilled20,
    EyeFilled20,
    BarChart20,
    Lock20,
    Lock24,
    LockFilled20,
    LockFilled24,
    YoutubeFilled16,
    YoutubeFilled20,
    InstagramFilled16,
    InstagramFilled20,
    XDotComFilled20,
    TiktokFilled16,
    TiktokFilled20,
    DiscordFilled16,
    DiscordFilled20,
    FacebookFilled16,
    FacebookFilled20,
    TelegramFilled16,
    TelegramFilled20,
    Twitch20,
    Linkedin20,
  } from '@frosted-ui/icons'
}
