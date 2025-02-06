import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  render() {
    const {error} = this.state
    const {FallbackComponent, children} = this.props
    if (error) return <FallbackComponent error={error} />
    return children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state
  const isIdle = status === 'idle'
  const isPending = status === 'pending'
  const isResolved = status === 'resolved'
  const isRejected = status === 'rejected'

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: 'pending', pokemon: null, error: null})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({
          status: 'resolved',
          pokemon: pokemonData,
          error: null,
        })
      })
      .catch(error => {
        setState({status: 'rejected', pokemon: null, error: error})
      })
  }, [pokemonName])

  if (isRejected) throw error
  if (isIdle) return 'Submit a pokemon'
  if (isPending) return <PokemonInfoFallback name={pokemonName} />
  if (isResolved) return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function ErrorFallback({error}) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
