import React from 'react'

const BookmarksContext = React.createContext({
  bookmarks: [],
  addBookmark: () => {},
  updateBookmark: () => {},
  deleteBookmark: () => {},
})

export default BookmarksContext
