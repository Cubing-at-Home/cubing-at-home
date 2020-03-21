import React from 'react'

export default function CubingIcon({ event }) {
	return (
		<span
			style={{
				fontSize: 30,
				'&:hover': {
					opacity: 0.7
				}
			}}
			className={` cubing-icon event-${event}`}
		/>
	)
}
