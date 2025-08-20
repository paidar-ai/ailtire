
class AActionInstance {
    static definition = {
        name: 'AActionInstance',
        description: 'Instance of a running or run action.',
        extends: 'ARunnable',
        attributes: {
        },
        associations: {
            def: {
                type: 'AAction',
                cardinality: 1,
                composition: false,
                owner: false,
            },
            parent: {
                type: 'AActivityInstance',
                cardinality: 1,
                composition: false,
                transient: true,
            }
        },
        statenet: {
            Init: {
                description: "Action created but not yet scheduled",
                events: {
                    start: {
                        Queued: {}
                    },
                    cancel: {
                        Cancelled: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Queued: {
                description: "Action is scheduled and waiting to run",
                events: {
                    dispatch: {
                        Running: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Running: {
                description: "Action is currently executing",
                events: {
                    success: {
                        Succeeded: {}
                    },
                    error: {
                        Failed: {}
                    },
                    timeout: {
                        TimedOut: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            TimedOut: {
                description: "Action did not complete within timeout",
                events: {
                    retry: {
                        Queued: {}
                    },
                    abort: {
                        Failed: {}
                    }
                },
                actions: {
                    entry: {
                        entry1: function (obj) {
                            return obj.parent.handleChildEvent({action: obj});
                        }
                    },
                    exit: {}
                }
            },
            Failed: {
                description: "Action failed (all retries exhausted or aborted)",
                events: {
                    retry: {
                        Queued: {}
                    }
                },
                actions: {
                    entry: {
                        entry1: function(obj) { return obj.parent.handleChildEvent({action: obj}); }
                    },
                    exit: {}
                }
            },
            Succeeded: {
                description: "Action completed successfully",
                events: {},
                actions: {
                    entry: {
                        entry1: function (obj) {
                            return obj.parent.handleChildEvent({action: obj});
                        }
                    },
                    exit: {}
                }
            },
            Blocked: {
                description: "Circuit breaker is open; executions are blocked",
                events: {
                    reset: {
                        Idle: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Cancelled: {
                description: "Action was cancelled",
                events: {},
                actions: {}
            }
        }
    }
}

module.exports = AActionInstance;

