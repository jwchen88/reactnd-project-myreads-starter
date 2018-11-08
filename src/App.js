import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import ListBooks from './ListBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book'

class BooksApp extends Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books:[],
    query:'',
    showingBooks:[]
  }

  componentDidMount(){
    BooksAPI.getAll().then((books) => {
      this.setState({books})
    })
  }

  updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.findIndex(b => b.id === book.id) > 0) {
      books = this.state.books.map(b => {
        if (b.id === book.id) {
          return {...book, shelf}
        } else {
          return b
        }
      })
    } else {
      books = [...this.state.books, {...book, shelf}]
    }

    this.setState({books})

    BooksAPI.update(book, shelf).then((data) => {

    })
  }

  updateQuery = (query) => {
    this.setState({query: query})
    let showingBooks=[]
    if (query){
      BooksAPI.search(query).then(response => {
        if (response.length){
          showingBooks = response.map(b => {
            const index = this.state.books.findIndex(c => c.id === b.id)
            if (index >= 0){
              return this.state.books[index]
            } else {
              return b
            }
          })
        }
        this.setState({showingBooks})
      })
    } else {
      this.setState({showingBooks})
    }
  }

  render() {
    const {query}=this.state

    return (
      <div className="app">
        <Route exact path="/search" render={({history}) =>(
          <div className="search-books">
            <div className="search-books-bar">
              <Link to='/' className="close-search">Close</Link>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={query}
                  onChange={(event) => this.updateQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.showingBooks.map(book => (
                  <li key = {book.id}>
                    <Book
                      book={book}
                      onUpdateBook={(book,shelf)=>{
                        this.updateShelf(book,shelf)
                        history.push('/')
                      }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}/>
        <Route exact path="/" render={() => (
          <ListBooks
            books={this.state.books}
            onUpdateShelf={(book,shelf)=>this.updateShelf(book,shelf)}
          />
        )}/>
      </div>
    )
  }
}

export default BooksApp
