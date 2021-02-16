import { useRef } from 'react';

function useFocus<T extends HTMLElement>() {
	const htmlElRef = useRef<T | null>(null)
	const setFocus = () => {
        if (htmlElRef.current !==null) htmlElRef.current.focus();
	}

	return [htmlElRef, setFocus]
}

export default useFocus
