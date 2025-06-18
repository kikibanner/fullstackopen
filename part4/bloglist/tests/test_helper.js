const Blog = require('../models/blog')

const initaialBlogs = [
    {
        title: 'Statistika dan Probabilitas',
        author: 'J.K. Rowling',
        url: 'https://github.com/kikibanner',
        likes: 100,
    },
    {
        title: 'Primbon Jawa',
        author: 'George Otwell',
        url: 'https://github.com/kikibanner123',
        likes: 200,
    },
]

const nonExistingId = async () => {
    const note = new Blog({ content: 'willremovethissoon' })
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initaialBlogs,
    nonExistingId,
    blogsInDb
}