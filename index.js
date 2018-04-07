import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const flags = {
  ARG: '🇦🇷',
  AUS: '🇦🇺',
  AUT: '🇦🇹',
  BEL: '🇧🇪',
  CAN: '🇨🇦',
  CHN: '🇨🇳',
  ENG: '🇬🇧',
  ESP: '🇪🇸',
  FIJ: '🇫🇯',
  GER: '🇩🇪',
  IND: '🇮🇳',
  ITA: '🇮🇹',
  JPN: '🇯🇵',
  KOR: '🇰🇷',
  NIR: '🇬🇧',
  RSA: '🇿🇦',
  SCO: '🇬🇧',
  SWE: '🇸🇪',
  THA: '🇹🇭',
  USA: '🇺🇸',
  VEN: '🇻🇪',
  WAL: '🇬🇧'
}

class DataContainer extends Component {
  constructor() {
    super()

    this.state = {
      data: null,
      isLoading: true
    }
  }

  componentDidMount() {
    fetch(
      'https://statdata.pgatour.com/r/014/leaderboard-v2mini.json'
    )
      .then(r => r.json())
      .then(data =>
        this.setState({
          data,
          isLoading: false
        })
      )
  }

  render() {
    const { data, isLoading } = this.state

    return isLoading ? (
      <p>Loading...</p>
    ) : (
      this.props.children(data)
    )
  }
}

const formatPar = n => (n > 0 ? `+${n}` : n === 0 ? 'E' : n)

const Player = ({
  current_position,
  player_bio: {
    country,
    first_name,
    last_name,
    is_amateur
  },
  rounds,
  status,
  thru,
  today,
  total,
  total_strokes
}) => (
  <tr className={status === 'cut' ? 'is-cut' : ''}>
    <td>{current_position}</td>
    <td className="align_left">
      {first_name} {last_name}
      {is_amateur && ' (A)'} {flags[country]}
    </td>
    <td>{formatPar(today)}</td>
    <td>{thru === 18 ? 'F' : thru}</td>
    {rounds.map(({ round_number, strokes }) => (
      <td key={round_number}>{strokes || '-'}</td>
    ))}
    <td>{total_strokes}</td>
    <td>{formatPar(total)}</td>
  </tr>
)

const Leaderboard = ({ leaderboard: { players } }) => (
  <table>
    <thead>
      <tr>
        <th>Pos</th>
        <th className="align_left">Name</th>
        <th>Today</th>
        <th>Thru</th>
        <th>Rd 1</th>
        <th>Rd 2</th>
        <th>Rd 3</th>
        <th>Rd 4</th>
        <th>Total</th>
        <th>Par</th>
      </tr>
    </thead>
    <tbody>
      {players.map(player => (
        <Player key={player.player_id} {...player} />
      ))}
    </tbody>
  </table>
)

const App = () => (
  <DataContainer>
    {data => <Leaderboard leaderboard={data.leaderboard} />}
  </DataContainer>
)

ReactDOM.render(<App />, document.getElementById('app'))
