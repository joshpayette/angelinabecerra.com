/**
 * Defines a link for main site navigation
 */
export type SiteLinkType =
  | {
      icon?: JSX.Element
      label: string
      path: string
      childLinks?: never
    }
  | {
      icon?: JSX.Element
      label: string
      path?: never
      childLinks: SiteLinkType[]
    }
