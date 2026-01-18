export function getCollectionGroups(
  collection: any,
  collectionView: any,
  collectionData: any,
  ...rest: any[]
): any[] {
  const elems = collectionView?.format?.collection_groups || []
  return elems.map(({ property, hidden, value: { value, type } }: any) => {
    const isUncategorizedValue = value === undefined
    const isDateValue = value?.range
    // TODO: review dates reducers
    const queryLabel = isUncategorizedValue
      ? 'uncategorized'
      : isDateValue
        ? value.range?.start_date || value.range?.end_date
        : value?.value || value

    const collectionGroup = collectionData[`results:${type}:${queryLabel}`]
    let queryValue =
      !isUncategorizedValue && (isDateValue || value?.value || value)
    let schema = collection.schema[property]

    // Checkbox boolen value must be Yes||No
    if (type === 'checkbox' && value) {
      queryValue = 'Yes'
    }

    if (isDateValue) {
      schema = {
        type: 'text',
        name: 'text'
      }

      // Simple implementation without date-fns
      try {
        if (queryLabel) {
          queryValue = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }).format(new Date(queryLabel))
        }
      } catch (e) {
        queryValue = queryLabel
      }
    }

    return {
      collectionGroup,
      schema,
      value: queryValue || 'No description',
      hidden,
      collection,
      collectionView,
      collectionData,
      blockIds: collectionGroup?.blockIds,
      ...rest
    }
  })
}
