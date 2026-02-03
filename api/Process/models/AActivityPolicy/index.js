class AActivityPolicy {
    static definition = {
        name: 'AActivityPolicy',
        description: 'Controls retry, timeout, circuit-breaker, concurrency and dedupe.',
        attributes: {
            triggerMode: {
                type: 'enum',
                description: 'This trigger the activity to actually start. the modes are as follows: "immediate", ' +
                    '"timer", "trigger-any", "trigger-all", "condition" ',
                values: ['immediate', 'timer', 'trigger-any', 'trigger-all', 'condition']
            },
            dedupe: {type: 'boolean', description: 'If true, skip steps with same dedupeKey in one workflow run'},
            dedupeKey: {
                type: 'function',
                description: 'fn(ctx)→string, used to skip re-running with same key in a single workflow instance'
            },
            condition: {type: 'function', description: 'function body to guard this activity from execution. ' +
                    'Used when the triggerMode is "condition"'},
            timerMs: {type: 'number', description: 'Interval in milliseconds'},
            retryPolicy: {type: 'json', description: '{ maxAttempts, backoff, initialDelayMs }'},
            timeoutMs: {type: 'number', description: 'Max runtime before failure'},
            circuitBreaker: {type: 'json', description: '{ failureThreshold, resetTimeoutMs }'},
            actionsMode: {type: 'enum', description: 'How to handle actions: "parallel", "sequential"', values: ['parallel', 'sequential']},
            concurrency: {type: 'number', description: 'Max parallel executions'},
        }
    }
}

module.exports = AActivityPolicy;
