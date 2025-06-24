const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const user = request.user
    const body = request.body

    if (!body.url || !body.title) {
        return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    // console.log('Saved blog:', savedBlog)
    response.status(201).json(savedBlog)
})

// blogsRouter.delete('/:id', async (request, response) => {
//     await Blog.findByIdAndDelete(request.params.id)
//     response.status(204).end()
// })

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete this blog' })
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const likes = request.body.likes

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }

    blog.likes = likes
    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})



module.exports = blogsRouter