import { DOMElement, DOMFleetManager } from '@dzeio/dom-manager'
import { textChangeRangeIsUnchanged } from 'typescript'

export default class Game {

	private table: DOMElement<HTMLTableElement>
	private columns: Array<Array<DOMElement>> = []

	private gameStarted = false

	public constructor(
		table: HTMLTableElement
	) {
		this.table = new DOMElement(table)
		this.setupGeneral()
	}

	public setupGeneral() {
		// Clear la table
		this.columns = []
		const rows = new DOMFleetManager('tr', this.table)
		rows.each((item, rowIndex) => {
			const cells = new DOMFleetManager('td', item)
			// cellIndex = 0-6
			cells.each((cell, cellIndex) => {
				if (this.columns.length <= cellIndex) {
					this.columns.push([])
				}
				this.columns[cellIndex].push(cell)

				cell
					.text(' ')
					.data('color', null)
					.data('winner', null)
				if (cell.data('event-added') === null) {
					cell.on('click', () => {
						if (this.gameStarted) {
							this.onPlayerMove(cell, cellIndex)
						}
					})
				cell.data('event-added', 'true')
				}

				// Put each cells in the corresponding column


			})
			console.log(this.columns)
		})

		// Setup la base du jeux
	}

	public setRestartButton(btn: DOMElement) {
		btn.on('click', () => {
			this.setupGeneral()
			this.startSinglePlayer()
		})
	}

	public isWaitingForPlayerMove = false
	public playerColor: 'red' | 'yellow' = 'red'
	public gameType: 'single' | 'multi' = 'single'

	public startSinglePlayer() {
		this.gameStarted = true
		this.isWaitingForPlayerMove = true
	}

	public setPlayerTurn(player: boolean) {
		const playerShower = DOMElement.get('.playerColor')
		if (!playerShower) {
			return
		}
		playerShower.text(player ? this.playerColor : this.playerColor === 'red' ? 'yellow' : 'red')
		if (player) {
			this.isWaitingForPlayerMove = true
		}
	}

	public setupMultiplayer() {}

	public onPlayerMove(cell: DOMElement, xPos: number) {
		if (this.isWaitingForPlayerMove) {
			this.isWaitingForPlayerMove = !this.makeMove(xPos, this.playerColor)
			if (this.isWaitingForPlayerMove) {
				return
			}
			if (this.gameType === 'single' && this.gameStarted) {
				setTimeout(() => {
					this.makeIATakeTurn()
					this.setPlayerTurn(true)
				}, getRandomInt(200, 2000))
			}
		}
	}

	/**
	 * Make a move and return and true if the move was done and false if the move was not done
	 */
	public makeMove(xPos: number, color: 'red' | 'yellow'): boolean {

		let cellToFill: DOMElement | undefined
		let yPos = 0
		for (let i = 0; i < this.columns[xPos].length; i++) {
			const cell = this.columns[xPos][i];
			const color = cell.data('color')
			if (!color) {
				cellToFill = cell
				yPos = i
			}
			if (color) {
				break
			}

		}
		console.log('cellToFill', cellToFill)
		if (!cellToFill) {
			return false
		}
		cellToFill.data('color', color)
		this.checkWinner(xPos, yPos)
		return true
	}

	public checkWinner(x: number, y: number) {
		const win = this.checkDirection(x, y, 'horizontal') || this.checkDirection(x, y, 'vertical') || this.checkDirection(x, y, 'diagonal-left') || this.checkDirection(x, y, 'diagonal-right')
		if (win === false) {
			console.log('FALSE')
			return false
		}
		console.log(win)
		win.forEach((item) => {
			console.log(item.data('winner', 'true'))
		})
		this.gameStarted = false
	}

	public checkDirection(x: number, y: number, direction: 'horizontal' | 'vertical' | 'diagonal-left' | 'diagonal-right'): Array<DOMElement> | false {
		console.log('Starting Check', direction)
		const color = this.columns[x][y].data('color')
		if (!color) {
			return false
		}
		const items = []
		let wentReverse: number | undefined
		for (let i = 0; i < 4; i++) {
			let newX = x
			if (direction === 'horizontal' || direction.startsWith('diagonal')) {
				newX = typeof wentReverse !== 'undefined' ? x + i - wentReverse : x - i
				if (direction === 'diagonal-left') {
					newX = typeof wentReverse !== 'undefined' ? x - i + wentReverse : x + i
				}
			}
			let newY = y
			if (direction === 'vertical' || direction.startsWith('diagonal')) {
				newY = typeof wentReverse !== 'undefined' ? y + i - wentReverse : y - i
			}

			console.log('index', i, 'y', newY, 'Y exist', this.isYCorrect(newY))
			console.log('index', i, 'x', newX, 'X exist', this.isXCorrect(newX))

			if (!this.isYCorrect(newY) || !this.isXCorrect(newX)) {
				if (typeof wentReverse === 'undefined') {
					wentReverse = --i
					continue
				}
				return false
			}
			const element = this.columns[newX][newY]

			console.log('element color', element.data('color'), 'color wanted', color)

			if (element.data('color') !== color) {
				if (typeof wentReverse === 'undefined') {
					wentReverse = --i
					continue
				}
				return false
			}
			items.push(element)
		}
		return items
	}

	private isXCorrect(x: number) {
		return x >= 0 && x < this.columns.length
	}

	private isYCorrect(y: number) {
		return y >= 0 && y < this.columns[0].length
	}

	public makeIATakeTurn() {
		let turnDone = false
		while (!turnDone) {
			const pos = getRandomInt(0, this.columns.length - 1)
			turnDone = this.makeMove(pos, 'red')
		}
	}

}
function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * ((max + 1) - min)) + min
}



// const cell = new DOMElement('tr')

// cell.data('color') // return 'red | 'yello' pour get
// cell.data('color', 'red') //return void pour set
