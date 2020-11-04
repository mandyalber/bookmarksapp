import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './UpdateBookmark.css'

const Required = () => (
    <span className='AddBookmark__required'>*</span>
)

export default class UpdateBookmark extends Component {

    static contextType = BookmarksContext;

    state = {
        id: '',
        title: '',
        url: '',
        description: '',
        rating: 1,
        error: null,
    };

    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId
        fetch(config.API_ENDPOINT +`/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(error => Promise.reject(error))
                //console.log(res.json())
                return res.json()
            })
            .then(responseData => {
                console.log(responseData)
                this.setState({
                    id: responseData.id,
                    title: responseData.title,
                    url: responseData.url,
                    description: responseData.description,
                    rating: responseData.rating,
                })
            })
            .catch(error => {
                console.error(error)
                this.setState({ error })
            })
    }

    handleChangeTitle = e => {
        this.setState({ title: e.target.value })
    };

    handleChangeUrl = e => {
        this.setState({ url: e.target.value })
    };

    handleChangeDescription = e => {
        this.setState({ description: e.target.value })
    };

    handleChangeRating = e => {
        this.setState({ rating: e.target.value })
    };

    handleSubmit = e => {
        e.preventDefault()
        const { bookmarkId } = this.props.match.params
        const { id, title, url, description, rating } = this.state
        const newBookmark = { id, title, url, description, rating }
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(newBookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${config.API_KEY}`
            },
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(error => Promise.reject(error))
            })
            .then(() => {
                this.resetFields(newBookmark)
                this.context.updateBookmark(newBookmark)
                this.props.history.push('/')
            })
            .catch(error => {
                console.error(error)
                this.setState({ error })
            })
    }

    resetFields = (newFields) => {
        this.setState({
            id: newFields.id || '',
            title: newFields.title || '',
            url: newFields.url || '',
            description: newFields.description || '',
            rating: newFields.rating || '',
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    };

    render() {
        const { error, title, url, description, rating } = this.state
        return (
            <section className='UpdateBookmarkForm'>
                <h2>Update Bookmark</h2>
                <form
                    className='UpdateBookmark__form'
                    onSubmit={this.handleSubmit}
                >
                    <div className='UpdateBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>Title{' '}<Required /></label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            placeholder='Great website!'
                            value={title}
                            onChange={this.handleChangeTitle}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>URL{' '}<Required /></label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            placeholder='https://www.great-website.com/'
                            value={url}
                            onChange={this.handleChangeUrl}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>Description</label>
                        <textarea
                            name='description'
                            id='description'
                            value={description}
                            onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>Rating{' '}<Required /></label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'                          
                            min='1'
                            max='5'
                            value={rating}
                            onChange={this.handleChangeRating}
                            required
                        />
                    </div>
                    <div className='AddBookmark__buttons'>
                        <button type='button' onClick={this.handleClickCancel}>Cancel</button>
                        {' '}
                        <button type='submit'>Save</button>
                    </div>
                </form>
            </section>
        )
    }
}