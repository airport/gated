/**
 * Vendor barrel — Frosted UI + a single shared React instance.
 * Import from `virtual:frosted-ui` (see nuxt.config.ts esbuild plugin).
 */
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
  frostedThemePlugin,
} from 'frosted-ui'
