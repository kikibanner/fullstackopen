const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'kikibannerblog', name: 'Rifki F. Akbar', passwordHash: 'salainen' })
    await user.save()
})

test('user is not created if password is too short', async () => {
    const newUser = {
        username: 'shortpw',
        name: 'Short Password',
        password: '12'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1) // hanya user dari beforeEach
})

test('user is not created if username already exists', async () => {
    const newUser = {
        username: 'kikibannerblog',
        name: 'Duplicate',
        password: 'salainen'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
})

after(async () => {
    await mongoose.connection.close()
})