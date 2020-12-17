type ItemToArray<T> = {
	[P in keyof T]?: Array<T[P]>
}

export default abstract class Listener<T extends Record<string, (...args: Array<any>) => void> = { newListener: (eventName: string, listener: Function) => void, removeListener: (eventName: string, listener: Function) => void }> {

	private maxListeners = 10

	private handlers: ItemToArray<T> = {}

	private internalAdd(push: boolean, event: keyof T, listener: T[typeof event]) {
		// @ts-expect-error
		this.emit('newListener', event, listener)
		let item = this.handlers[event]
		if (!item) {
			this.handlers[event] = [listener]
			item = this.handlers[event]
		} else {
			if (push) {
				item.push(listener)
			} else {
				item.unshift(listener)
			}
		}
		if ((item?.length || 1) > this.maxListeners) {
			console.warn(`Warning: more than ${this.maxListeners} are in the event ${event}! (${item?.length || 1})`)
		}
		return this
	}

	on(event: keyof T, listener: T[typeof event]) {
		return this.internalAdd(true, event, listener)
	}

	prependListener(event: keyof T, listener: T[typeof event]) {
		return this.internalAdd(false, event, listener)
	}

	prependOnceListener(event: keyof T, listener: T[typeof event]) {
		const fn = (...args: Array<any>) => {
			listener(...args)
			this.off(event, fn as any)
		}
		this.prependListener(event, fn as any)
		return this
	}

	once(event: keyof T, listener: T[typeof event]) {
		const fn = (...args: Array<any>) => {
			listener(...args)
			this.off(event, fn as any)
		}
		this.on(event, fn as any)
		return this
	}

	emit(event: keyof T, ...ev: Parameters<T[typeof event]>) {
		for (const fn of this.listeners(event)) {
			fn(...ev)
		}
		return this
	}

	off(event: keyof T, listener: T[typeof event]) {
		const listeners = this.listeners(event)
		const index = listeners.indexOf(listener)
		if (index !== -1) {
			(this.handlers[event] as Array<T[typeof event]>).splice(index, 1)
		}

		// @ts-expect-error
		this.emit('removeListener', event, listener)
		return this
	}

	public removeListener(event: keyof T, listener: T[typeof event]) {
		return this.off(event, listener)
	}

	public removeAllListeners(event: keyof T) {
		this.handlers[event] = []
		return this
	}

	public listenerCount(event: keyof T) {
		return this.listeners(event).length
	}

	public listeners(event: keyof T) {
		const item = this.handlers[event] as Array<T[typeof event]>
		if (!item) {
			return []
		}
		return item
	}

	public rawListeners(event: keyof T) {
		return this.listenerCount(event)
	}

	public eventNames() {
		return Object.keys(this.handlers)
	}

	public setMaxListeners(n: number) {
		this.maxListeners = n
	}

	// Browser Listeners
	addEventListener(event: keyof T, listener: T[typeof event]) {
		return this.on(event, listener)
	}

	removeEventListener(event: keyof T, listener: T[typeof event]) {
		return this.off(event, listener)
	}
}
