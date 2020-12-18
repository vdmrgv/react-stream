import { useState, useEffect, useCallback, useRef } from 'react';
import _filter from 'lodash/filter';
import io from 'socket.io-client';
import { SOCKET_ENDPOINT } from '../constants';

const useEventStream = () => {
	const [state, setState] = useState({
		events: [],
		isStreamActive: true,
		filterValue: '',
		filteredEvents: [],
	});
	const [error, setError] = useState(null);

	const socketRef = useRef({});

	const activateSocket = useCallback(() => {
		socketRef.current = io(SOCKET_ENDPOINT);

		socketRef.current.on('events', (events) => {
			setState((prevState) => ({ ...prevState, events: [...events, ...prevState.events]}))
		});

		socketRef.current.on('connect_error', () => {
			setError('Server unavailable');
		});

		socketRef.current.on('error', () => {
			setError('Server error');
		});
	}, []);

	const closeSocket = useCallback(() => {
		socketRef.current?.close();
	}, []);

	useEffect(() => {
		const isActive = state.isStreamActive;

		if (isActive) {
			activateSocket();
		} else {
			closeSocket();
		}

		return () => closeSocket();
	}, [activateSocket, closeSocket, state.isStreamActive]);

	const filteredEvents = useCallback(
		() =>
			_filter(state.events, (event) => {
				const lowerFilterValue = state.filterValue.toLowerCase();

				return (
					event.properties?.path?.toLowerCase().includes(lowerFilterValue) ||
					event.traits?.email?.toLowerCase().includes(lowerFilterValue) ||
					event.type.toLowerCase().includes(lowerFilterValue) ||
					event.event?.toLowerCase().includes(lowerFilterValue) ||
					event.receivedAt.toLowerCase().includes(lowerFilterValue)
				);
			}),
		[state.filterValue, state.events]
	);

	const toggleStream = (isActive) => {
		setState({
			...state,
			isStreamActive: isActive,
		});
	};

	const updateFilter = (filterValue) => {
		setState({
			...state,
			filterValue,
		});
	};

	return {
		error,
		isStreamActive: state.isStreamActive,
		filteredEvents: filteredEvents(),
		toggleStream,
		updateFilter,
	};
};

export default useEventStream;
