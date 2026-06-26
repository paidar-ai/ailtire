import {writable, get, derived} from "svelte/store";
import {io} from 'socket.io-client';

import {API_BASE_URL} from "../config";

// The main store to hold the entire architecture
export const events = writable({});
export const eventNodes = writable([]);
const eventMap = {};
let socket = null;

export function watchEvents(eventName, callback) {
    eventMap[eventName] = callback;
}

export function fetchEvents() {
    if(socket) return;

    socket = io();
    /*
    let socket = io(window.location.origin,
        {path: `${API_BASE_URL}/socket.io`}
    );

     */
    socket.on('connect', () => {
        console.log("Connected");
        eventNodes.update(msgs => [ {
            type: 'status', data: 'Connected', timestamp: new Date().toISOString()}, ...msgs
        ]);
    });
    socket.on('connect_error', (err) => {
        console.log("Connection error", err);
    });
    socket.onAny((event, data) => {
        console.log(event, data);
        let currentEvent = event;
        while (currentEvent) {
            if (eventMap.hasOwnProperty(currentEvent)) {
                eventMap[currentEvent](data);
            }

            // Move up the hierarchy to check for more general events
            const lastDotIndex = currentEvent.lastIndexOf(".");
            currentEvent = lastDotIndex > 0 ? currentEvent.substring(0, lastDotIndex) : null;
        }
        eventNodes.update(msgs => [
            {type: event, data, timestamp: new Date().toISOString()},
            ...msgs
        ])
    });
    socket.on('disconnect', () => {
        console.log("Disconnected");
        eventNodes.update(msgs => [ {
            type: 'status', data: 'Disconnected', timestamp: new Date().toISOString()}, ...msgs
        ]);
    });
    return eventNodes;
}