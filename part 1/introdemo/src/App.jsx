const Hello = (props) => {
  console.log(props)
  return(
    <div>
      {/* Nama variabel yang di-pass bebas hgak harus props */}
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const friends = ['Peter', 'Bob']
  return (
    <>
      <h1>Greetings</h1>
      <p>{friends}</p>
    </>
  )
}

export default App
