export const updateIn = (object, [property, ...properyChain], updater) =>
	properyChain.length === 0
		? { ...object, [property]: updater(object[property]) }
		: {
				...object,
				[property]: updateIn(object[property], properyChain, updater)
		  }

export const mapIn = (object, properyChain, mapper) =>
	updateIn(object, properyChain, array => array && array.map(mapper))

export const setIn = (object, properyChain, value) =>
	updateIn(object, properyChain, () => value)

const sortOutput = (a, b) => (a > b ? 1 : b > a ? -1 : 0)

export const sortArrayBy = (arr, criteria) => {
	return arr.sort((a, b) => sortOutput(a.criteria, b.criteria))
}
export const sortArrayByDate = arr => {
	return arr.sort((a, b) =>
		sortOutput(new Date(a.start_date), new Date(b.start_date))
	)
}

export const pick = (obj, keys) =>
	keys.reduce((newObj, key) => ({ ...newObj, [key]: obj[key] }), {})

export const getPreciseTime = wcaTime => {
	const wcaTimeStr = wcaTime.toString()
	const time = `${wcaTimeStr.slice(0, -2)}.${wcaTimeStr.slice(-2)}`
	return time
}
