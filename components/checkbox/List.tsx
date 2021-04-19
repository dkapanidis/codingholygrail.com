import React from 'react'

/**
 * Checkbox List on Blog Posts
 *
 * @param children The content.
 */
type ListProps = { children: any }
function List({ children }: ListProps) {
  return (
    <div className="list-disc space-y-2">
      {children}
    </div>
  )
}

export default List