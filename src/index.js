import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const name = "square" + (props.isHighlighted ? " highlighted" : "")
  return (
    <button className={name} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isHighlighted={this.props.line ? this.props.line.indexOf(i) !== -1 : false}
      />
    );
  }

  render() {
    return (
      <div>
        {[...Array(3).keys()].map(n => {
          return (
            <div className="board-row" key={n}>
              {[...Array(3).keys()].map(m => {
                return this.renderSquare(n*3+m)
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        order: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      orderIsAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        order: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  switchOrder() {
    this.setState({
      orderIsAsc: !this.state.orderIsAsc,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)[0];

    const moves = history.map((step, n) => {
      const move = this.state.orderIsAsc ? n : [...Array(history.length).keys()].reverse()[n]
      const coordinate = showCoordinate(history[move].order)
      const desc = move ?
        'Go to move #' + move + '(col: ' + coordinate[0] + ', row: ' + coordinate[1] + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'bold' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            line={calculateWinner(current.squares)[1]}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <ol><li><button onClick={() => this.switchOrder()}>Switch Order</button></li></ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

function showCoordinate(n) {
  // eslint-disable-next-line default-case
  switch(n) {
    case null: return [null, null]
    case 0: return [1, 1]
    case 1: return [2, 1]
    case 2: return [3, 1]
    case 3: return [1, 2]
    case 4: return [2, 2]
    case 5: return [3, 2]
    case 6: return [1, 3]
    case 7: return [2, 3]
    case 8: return [3, 3]
  }
}
