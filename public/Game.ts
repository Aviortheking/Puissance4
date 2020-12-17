import { DOMElement, DOMFleetManager } from '@dzeio/dom-manager'
import { textChangeRangeIsUnchanged } from 'typescript'

export default class Game {

	private table: DOMElement<HTMLTableElement>
	private columns: Array<Array<DOMElement>> = []
	private rows: Array<Array<DOMElement>> = []

	public constructor(
		table: HTMLTableElement
	) {
		this.table = new DOMElement(table)
		this.setupGeneral()
	}

	public setupGeneral() {
		// Clear la table
		const rows = new DOMFleetManager('tr', this.table)
		rows.each((item, rowIndex) => {
			const cells = new DOMFleetManager('td', item)
			this.rows.push([])
			// cellIndex = 0-6
			cells.each((cell, cellIndex) => {
				this.rows[rowIndex].push(cell)
				if (this.columns.length <= cellIndex) {
					this.columns.push([])
				}
				this.columns[cellIndex].push(cell)

				cell
					.text(' ')
					.data('color', null)

				// Put each cells in the corresponding column


			})
			console.log(this.columns)
		})

		// Setup la base du jeux

	}

	public setupMultiplayer() { }

	public setupSinglePlayer() { }

	/**
	 * Make a move and return and true if the move was done and false if the move was not done
	 */
	public makeMove(xPos: number, color: 'red' | 'yellow'): boolean {
		let cellToFill: DOMElement | undefined
		for (const cell of this.columns[xPos]) {
			const color = cell.data('color')
			if (!color) {
				cellToFill = cell
			}
			if (color) {
				break
			}
		}

		if (!cellToFill) {
			return false
		}
		cellToFill.data('color', color)
		return true
	}

	public checkWinner() {

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
