declare module 'virtual:frosted-ui' {
  import type {
    ComponentType,
    ReactElement,
    ReactNode,
    Key,
    JSXElementConstructor,
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
    frostedThemePlugin,
  } from 'frosted-ui'
}
