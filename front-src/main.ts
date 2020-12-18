import './style.css'

import Game from './Game'
import { DOMElement } from '@dzeio/dom-manager'

/**
 * Mise en place de l'environnement de jeu
 */
const table = document.querySelector('table')

if (!table) {
	throw new Error('Table not found')
}

const game = new Game(table)
game.playerColor = 'yellow'

/**
 * Récupération des éléments nécéssaires
 */

const btnWrapper = DOMElement.get('.chooseSetup')
const multiplayerOptions = DOMElement.get('.playerOption')
const input = DOMElement.get<HTMLInputElement>('#sessionID')
const giveUpWrapper = DOMElement.get('.giveUp')
const btnJoinGame = DOMElement.get('.joinSession')
const btnCreateGame = DOMElement.get('.createSession')
const btnBackInMenu = DOMElement.get('#backInMenu')
const userMessage = DOMElement.get('#usermessage')
const messageVictoire = DOMElement.get('.victoire')
const continueBtn = DOMElement.get('.continueBtn')


/**
 * Comportement du DOM lors du reset de la partie
 */
game.onReset = () => {
	btnWrapper?.style('display', '')
	multiplayerOptions?.style('display', 'none')
	giveUpWrapper?.style('display', 'none')
	messageVictoire?.text('')
	continueBtn?.style('display', 'none')
}

/**
 * Comportement du DOM lors d'une victoire
 */
game.onWin = (winner) => {
	console.log(winner)
	if (!winner) {
		messageVictoire?.text('Égalité !')
	} else {
		messageVictoire?.text(`Le Joueur ${winner} à gagné !`)
	}
	continueBtn?.style('display', '')
}

/**
 * Comportement du DOM lors du lancement d'une partie
 */
game.onMultiStart = () => {
	giveUpWrapper?.style('display', '')
	multiplayerOptions?.style('display', 'none')
	userMessage?.style('display', 'none')
}
/**
 * Comportement du DOM et du jeu lorsqu'un utilisateur rejoins une partie
 */
btnJoinGame?.on('click', () => {
	const numberSession = input?.item.valueAsNumber || 0
	game.joinMultiplayerGame(numberSession)
})

/**
 * Comportement du DOM et du jeu lorsqu'un utilisateur créer une partie
 */

btnCreateGame?.on('click', async () => {
	const id = await game.createMultiplayerGame()
	if (!input) {
		return
	}
	input.item.valueAsNumber = id
	input.attr('readOnly', true)
	userMessage?.style('display', '')
	btnCreateGame?.style('display', 'none')
	btnJoinGame?.style('display', 'none')

})
/**
 * Comportement du DOM et du jeu lorsqu'un utilisateur relance une partie
 */

continueBtn?.on('click', () => {
	game.continueGame()
	messageVictoire?.text('')
	continueBtn?.style('display', 'none')
})

/**
 * Comportement du DOMlorsqu'un utilisateur retourne sur le menu
 */
DOMElement.get('#backInMenu', multiplayerOptions)?.on('click', () => {
	btnWrapper?.style('display', 'flex')
	btnBackInMenu?.style('display', 'none')
	btnCreateGame?.style('display', 'flex')
	userMessage?.style('display', 'none')

	multiplayerOptions?.style('display', 'none')
	game.cleanMultiplayer()
})
/**
 * Comportement du DOM et du jeu lorsqu'un utilisateur lance une partie contre l'IA
 */

DOMElement.get('.vsAI', btnWrapper)?.on('click', () => {
	game.startSinglePlayer()
	btnWrapper?.style('display', 'none')
	giveUpWrapper?.style('display', '')
	userMessage?.style('display', 'none')
})

/**
 * Comportement du DOM et du jeu lorsqu'un utilisateur souhaite lancer une partie en multijoueur
 */
DOMElement.get('.vsPlayer', btnWrapper)?.on('click', () => {
	multiplayerOptions?.style('display', 'flex')
	btnJoinGame?.style('display', 'flex')

	game.setupMultiplayer()
	btnWrapper?.style('display', 'none')
	multiplayerOptions?.style('display', '')
	if (input?.item) {
		input.item.value = ''
	}
	btnBackInMenu?.style('display', 'flex')

})
/**
 * Comportement du DOM et du jeu lorsqu'un utilisateur recommence une partie
 */
const restartBtn = DOMElement.get('.restartBtn')?.on('click', () => {
	game.resetGame()
})

window.game = game
