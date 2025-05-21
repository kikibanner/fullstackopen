const Header = ({ course }) => {
    console.log(course)
    return <h1>{course}</h1>

}

const Part = ({ part, exercises }) => {
    return (
        <p>{part} {exercises}</p>
    )
}

const Content = ({ parts }) => {
    return (
        <>
            {parts.map((part) => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
        </>
    )
}

const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum += part.exercises, 0)
    return (
        <b>
            <p>total of {totalExercises} exercises</p>
        </b>
    )
}

const Course = ({ course }) => {
    return (
        <>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

export default Course