class Index {
    static definition = {
        name: 'ATrigger',
        description: 'Defines an event-, timer- or conditional trigger for an activity',
        attributes: {
            type: {
                type: 'enum',
                description: 'Trigger type: "event", "timer" or "condition"',
                values: ['event', 'timer', 'condition'],
            },
            description: {
                type: 'string',
                description: 'Description of the trigger',
            },
            event: {
                type: 'string',
                description: 'Name of the event to listen for (when type="event")',
            },
            condition: {
                type: 'string',
                description: 'JS expression or function body to guard this trigger; receives (payload, context)',
            },
            intervalMs: {
                type: 'number',
                description: 'Interval in milliseconds (when type="timer")',
            },
            repeat: {
                type: 'boolean',
                description: 'Whether a timer trigger should fire repeatedly',
            },
        }
    }
}

module.exports = Index;
