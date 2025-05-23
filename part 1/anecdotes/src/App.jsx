import { useState } from 'react'

const Display = (props) => <div>{props.value}</div>

const Header = (props) => <h1>{props.value}</h1>

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  // const [votes, setVotes] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 })
  const [votes, setVotes] = useState(anecdotes.reduce((obj, _, idx) => ({ ...obj, [idx]: 0 }), {}))

  const handleNextAnecdote = () => {
    const index = Math.floor((Math.random() * anecdotes.length))
    setSelected(index)
  }

  const hanldeVote = () => {
    setVotes({ ...votes, [selected]: votes[selected] + 1 })
  }

  const mostVotes = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b)

  return (
    <div>
      <Header value="Anecdote of the day" />
      <Display value={anecdotes[selected]} />
      <Display value={`has ${votes[selected]} votes`} />
      <Button onClick={hanldeVote} text="vote" />
      <Button onClick={handleNextAnecdote} text="next anecdote" />

      <Header value="Anecdote with most votes" />
      <Display value={anecdotes[mostVotes]} />
      <Display value={`has ${votes[mostVotes]} votes`} />
    </div>
  )
}

export default App