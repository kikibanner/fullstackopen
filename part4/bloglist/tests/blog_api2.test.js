const assert = require('node:assert')
const { test, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

// Tambahkan sebelumEach untuk user dan token
let token

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Buat user baru
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    // Login untuk dapatkan token
    const response = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })

    token = response.body.token

    await Blog.insertMany(helper.initaialBlogs)
})

test('creating a valid blog post with token increases total by one', async () => {
    const newBlog = {
        title: 'Blog with token',
        author: 'Author',
        url: 'http://example.com',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initaialBlogs.length + 1)
})

test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
        title: 'No token blog',
        author: 'Author',
        url: 'http://example.com',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})