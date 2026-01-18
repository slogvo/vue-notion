import { NotionAPI } from '@slogvo/notion-client'

export default defineEventHandler(async event => {
  const pageId = getRouterParam(event, 'pageId')

  if (!pageId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page ID is required'
    })
  }

  const api = new NotionAPI()
  try {
    const recordMap = await api.getPage(pageId)
    return recordMap
  } catch (err: any) {
    console.error(err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    })
  }
})
