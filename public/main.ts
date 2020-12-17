import './style.css'

import Game from './Game'
import { DOMElement } from '@dzeio/dom-manager'

const table = document.querySelector('table')

if (!table) {
	throw new Error('Table not found')
}

const game = new Game(table)
const restartBtn = DOMElement.get('.restartBtn')
if (restartBtn) {
	game.setRestartButton(restartBtn)
}

game.playerColor = 'yellow'
game.startSinglePlayer()

window.dm = DOMElement
