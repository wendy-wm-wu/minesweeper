import React, { Component } from 'react';
import '../style.css';
import Row from './Row';

class App extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      board: [],
      bombs: 10,
      gameOver: false,
      message: '',
    }
  }
  componentDidMount = () => {
    this.initBoard(); 
  }

  initBoard = () => {
    this.setState({ board: this.createBoard() }); 
    this.insertBombs(); 
    this.computeCells(); 
  }

  createBoard = () => {
    let board = this.state.board; 
    for (let i = 0; i < 8; i++) {
      board[i] = []; 
      for (let j = 0; j < 8 ; j++) {
        board[i][j] = { isBomb: false, reveal: false, display: null, isFlagged: false, isEmpty: false }; 
      }
    }
    return board; 
  }

  insertBombs = () => {
    let count = 0; 
    let board = this.state.board; 
    let n = this.state.board.length; 
    let row, col; 
    while (count < this.state.bombs) {
      row = Math.floor(Math.random() * n); 
      col = Math.floor(Math.random() * n); 
      if (!board[row][col].isBomb) {
        board[row][col].isBomb = true; 
        count++; 
      }
    }
  }

  computeCells = () => {
    let n = this.state.board.length; 
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.computeCell(i, j, n); 
      }
    }
  }

  computeCell = (row, col, n) => {
    let board = this.state.board; 
    let cells = [];
    if (board[row][col].isBomb) {
      board[row][col].display = 'B'; 
      return; 
    }
    var count = 0; 
    //up row - 1, col
    if (row !== 0) {
      count += board[row - 1][col].isBomb ? 1 : 0; 
      cells.push(board[row - 1][col]); 
    }
    //down row + 1, col
    if (row !== n - 1) {
      count += board[row + 1][col].isBomb ? 1 : 0;
      cells.push(board[row + 1][col]); 
    }
    //left row, col - 1
    if (col !== 0) {
      count += board[row][col - 1].isBomb ? 1 : 0;
      cells.push(board[row][col - 1]); 
    }
    //right row, col + 1
    if (col !== n - 1) {
      count += board[row][col + 1].isBomb ? 1 : 0; 
      cells.push(board[row][col + 1]);
    }
    //upleft row - 1, col - 1
    if (row !== 0 && col !== 0) {
      count += board[row - 1][col - 1].isBomb ? 1 : 0;
      cells.push(board[row - 1][col - 1]); 
    }
    //upright row - 1, col + 1
    if (row !== 0 && col !== n - 1) {
      count += board[row - 1][col + 1].isBomb ? 1 : 0;
      cells.push(board[row - 1][col + 1]);
    }
    //downleft row + 1, col - 1
    if (row !== n - 1 && col !== 0) {
      count += board[row + 1][col - 1].isBomb ? 1 : 0;
      cells.push(board[row + 1][col - 1]);
    }
    //downright row + 1, col + 1
    if (row !== n - 1 && col !== n - 1) {
      count += board[row + 1][col + 1].isBomb ? 1 : 0; 
      cells.push(board[row + 1][col + 1]); 
    }
    if (count === 0) {
      board[row][col].isEmpty = true; 
    } else {
      board[row][col].display = count.toString(); 
    }
    return cells; 
  }

  countFlags = () => {
    let board = this.state.board;
    let count = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j].isFlagged) {
          count++;
        }
      }
    }
    return count; 
  }

  countHiddenCells = () => {
    let board = this.state.board; 
    let count = 0; 
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (!board[i][j].reveal) {
          count++; 
        }
      }
    }
    return count; 
  }

  play = (row, col) => {
    let board = this.state.board;
    if (board[row][col].reveal || board[row][col].isFlagged) return null; 

    if (board[row][col].isBomb) {
      this.setState({ board, gameOver: true, message: "Game over. You lost." }); 
      this.revealBoard(); 
    } 

    board[row][col].reveal = true;
    board[row][col].isFlagged = false; 

    if (board[row][col].isEmpty) {
      board = this.revealEmpty(row, col); 
    }

    if (this.countHiddenCells() === this.state.bombs) {
      this.setState({ board, gameOver: true, message: "You win!" });
      this.revealBoard(); 
    }
    this.setState({ board, bombs: this.state.bombs - this.countFlags() }); 
  }

  revealBoard = () => {
    let board = this.state.board; 
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        board[i][j].reveal = true; 
      }
    }
    this.setState({ board }); 
  }

  revealEmpty = (row, col) => {
    let area = this.computeCell(row, col, this.state.board.length); 
    let board = this.state.board; 
    for (let k = 0; k < area.length; k++) {
      let value = area[k]; 
      if (!value.isFlagged && !value.reveal && (value.isEmpty || !value.isBomb )) {
        board[row][col].reveal = true; 
        if (value.isEmpty) {
          this.revealEmpty(value[row], value[col]); //recursively reveal 
        }
      }
    }
    this.setState({ board }); 
  }

  render() {
    return(
      <div className="board">
        <h1> Minesweeper </h1>
        <table>
          <thead></thead>
          <tbody>
            {this.state.board.map((row, i) => <Row key={i} row={row} />)}
          </tbody>
        </table>
        <p className="message">{this.state.message}</p>
      </div>
    );
  }
}

export default App;
