
class AActivityInstance {
    static definition = {
        name: 'AActivityInstance',
        description: 'Instance of a running or run activity.',
        extends: 'ARunnable',
        attributes: {
        },
        associations: {
           def: {
                type: 'AActivity',
                cardinality: 1,
                composition: false,
                owner: false,
            },
            actions: {
               type: "ARunnable",
                cardinality: "n",
                composition: true,
                owner: true,
            }
        },
        statenet: {
            Init: {
                description: "Activity created, not yet listening for triggers",
                events: {
                    create: {
                        Waiting: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Waiting: {
                description: "Listening for any configured trigger",
                events: {
                    trigger: {
                        Triggered: {
                            condition: function (obj, args) {
                                return obj.evalTriggerGuard({event: obj.currentEvent});
                            },
                        },
                    },
                    start: {
                        Running: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Blocked: {
                description: "Circuit breaker is open; executions are blocked",
                events: {
                    tigger: {
                        Triggered: {
                            condition: function (obj) {
                                return obj.evalTriggerGuard({event: obj.currentEvent});
                            },
                        },
                    }
                },
                actions: {
                    entry: {},
                }
            },
            Triggered: {
                description: "Trigger matched, ready to start",
                events: {
                    start: {
                        Running: {}
                    },
                    cancel: {
                        Cancelled: {}
                    }
                },
                actions: {
                    entry: {
                       entry1: function(obj) { return obj.start();}
                    },
                    exit: {}
                }
            },
            Running: {
                description: "Executing the activity’s actions",
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
                description: "Execution exceeded timeout",
                events: {
                    retry: {
                        Running: {}
                    },
                    abort: {
                        Failed: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Failed: {
                description: "Activity failed (all retries exhausted or aborted)",
                events: {
                    retry: {
                        Running: {}
                    },
                    abort: {
                        Cancelled: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Succeeded: {
                description: "Activity completed successfully",
                events: {},
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Cancelled: {
                description: "Activity was cancelled",
                events: {},
                actions: {
                    entry: {},
                    exit: {}
                }
            }
        }
    }
}

module.exports = AActivityInstance;

