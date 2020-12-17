import './style.css'

import Game from './Game'

const table = document.querySelector('table')

if (!table) {
	throw new Error('Table not found')
}

const game = new Game(table)
game.makeMove(0, 'red')
game.makeIATakeTurn()
game.makeMove(0, 'red')
game.makeMove(0, 'red')
game.makeMove(0, 'red')
game.makeMove(0, 'red')
game.makeMove(0, 'red')
game.makeMove(0, 'red')
game.makeMove(0, 'red')
