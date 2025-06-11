const dummy = (blogs) => {
    blogs[0]
    return 1
}

const totalLikes = (blogs) => {
    return blogs[0].likes
}

const favouriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const favourite = blogs.reduce((mostLiked, blog) => {
        return blog.likes > mostLiked.likes ? blog : mostLiked
    })

    // ga pakai akumulator karena lagi nyari perbandingan
    return favourite.likes
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts
    }, {})

    const mostFrequentAuthor = Object.keys(authorCounts).reduce((mostFrequent, author) => {
        return authorCounts[author] > authorCounts[mostFrequent] ? author : mostFrequent
    })

    return {
        author: mostFrequentAuthor,
        blogs: authorCounts[mostFrequentAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}