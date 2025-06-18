const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initaialBlogs)

})

test('veryfying the amount of blog post...', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})

test('the unique identifier are named id...', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert(blog.id !== undefined)
        assert(blog._id === undefined)
    })
})

test('creating a valid a blog post through HTTP POST, the total blog post increased by one', async () => {
    const newBlog = {
        title: 'Statistika dan Probabilitas: the Sequel',
        author: 'J.K. Rowling',
        url: 'https://github.com/kikibannerthesequel',
        likes: 100,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initaialBlogs.length + 1)

    const savedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    assert.strictEqual(savedBlog.author, newBlog.author)
    assert.strictEqual(savedBlog.url, newBlog.url)
    assert.strictEqual(savedBlog.likes, newBlog.likes)
})

test('if the field \'likes\' is missing, it will be defaulted as 0', async () => {
    const newBlogWithouLlikes = {
        title: 'Statistika dan Probabilitas: the Third',
        author: 'J.K. Rowling',
        url: 'https://github.com/kikibannerthethird',
    }

    await api
        .post('/api/blogs')
        .send(newBlogWithouLlikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)
})

test('if the field \'title\' or \'url\' are missing, it will be 400 Bad Request', async () => {
    const newBlogWithouTitleAndUrl = {
        author: 'Tatang Sutarman',
    }

    await api
        .post('/api/blogs')
        .send(newBlogWithouTitleAndUrl)
        .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})