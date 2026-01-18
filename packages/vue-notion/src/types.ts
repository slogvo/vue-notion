import type { ExtendedRecordMap, Block } from '@slogvo/notion-types'

export type MapPageUrlFn = (pageId: string) => string
export type MapImageUrlFn = (url: string, block: Block) => string
export type SearchNotionFn = (params: any) => Promise<any>

export interface NotionComponents {
  // Core components
  Image: any
  Link: any
  PageLink: any
  Checkbox: any
  Text: any

  // Blocks
  Code: any
  Equation: any
  Collection: any
  Modal: any
  Pdf: any

  // Custom components
  Header: any

  // Third party
  nextImage?: any
  nextLink?: any
}

export interface NotionContext {
  recordMap: ExtendedRecordMap
  components: NotionComponents
  mapPageUrl: MapPageUrlFn
  mapImageUrl: MapImageUrlFn
  searchNotion?: SearchNotionFn
  fullPage: boolean
  darkMode: boolean
  previewImages: boolean
  showTableOfContents: boolean
  minTableOfContentsItems: number
  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition: number
  forceCustomImages: boolean
  zoom?: any
  hideHeader?: boolean
}
