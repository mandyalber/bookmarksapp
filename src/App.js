import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import BookmarksContext from './BookmarksContext';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';
import UpdateBookmark from './UpdateBookmark/UpdateBookmark';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bm =>
      bm.id !== bookmarkId
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  updateBookmark = updatedBookmark => {
    this.setState({
      bookmarks: this.state.bookmarks.map(bm =>
        (bm.id !== updatedBookmark.id) ? bm : updatedBookmark
      )
    })
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      updateBookmark: this.updateBookmark,
      deleteBookmark: this.deleteBookmark,
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route path='/add-bookmark' component={AddBookmark}/>
            <Route exact path='/' component={BookmarkList}/>
            <Route path='/update/:bookmarkId' component={UpdateBookmark}/>
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;

/*  Create a new Route that will contain a form for editing bookmarks
    Create a component that contains a form for updating bookmarks
    
    On your list of bookmarks, add a button/link on each bookmark that links to the edit route for that bookmark
        You can either: use a Link from react-router-dom
        or use a button that calls history.push when it's clicked
    
    The edit bookmark form should display fields that are pre-populated with the existing bookmark's field values
    
    The edit bookmark form should submit a PATCH request to your bookmarks-server with the new bookmark field values
    
    If the PATCH request is successful, update the bookmark stored in context with the new values and redirect the user back to the list of bookmarks
*/