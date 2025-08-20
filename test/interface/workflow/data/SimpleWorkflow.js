module.exports = {
    "name": "User Registration",
    "description": "Register a new user account, validate email, and send welcome email.",
    "precondition": "Visitor has provided email and password",
    "postcondition": "User account exists and welcome email has been sent",
    "category": "User/Auth",
    "inputs": {
        "email": {
            "description": "User’s email address",
            "type": "string",
            "required": true
        },
        "password": {
            "description": "User’s chosen password",
            "type": "string",
            "required": true
        }
    },
    "outputs": {
        "userId": {
            "description": "ID of the newly created user account",
            "fn": "ctx => ctx.activities.CreateAccount.actions[0].outputs.userId"
        }
    },
    "activities": {
        "CollectUserInfo": {
            "description": "Accept and sanitize user input",
            "triggers": [
                {"type": "event", "event": "workflow.start"}
            ],
            "policy": {
                "executeMode": "immediate",
                "retryPolicy": {"maxAttempts": 1, "backoff": "fixed", "initialDelayMs": 0},
                "timeoutMs": 5000
                "actionsMode": "sequential",
            },
            "actions": [
                {
                    "name": "SanitizeInput",
                    "type": "action",
                    "fn": (ctx) => { email: ctx.inputs.email.trim(), password: ctx.inputs.password },
                    "outputs": {
                        "sanitized": "ctx => ctx.actions[0].outputs"
                    }
                }
            ],
            "outputs": {
                "userInfo": {
                    "description": "Sanitized credentials",
                    "fn": "ctx => ctx.actions[0].outputs.sanitized"
                }
            }
        },

        "ValidateEmail": {
            "description": "Check that the email is not already in use",
            "triggers": [
                {"type": "event", "event": "CollectUserInfo.succeeded"}
            ],
            "policy": {
                "executeMode": "wait",
                "retryPolicy": {"maxAttempts": 2, "backoff": "fixed", "initialDelayMs": 100},
                "timeoutMs": 5000,
                "actionsMode": "sequential",
            },
            "actions": [
                {
                    "name": "CheckDuplicateEmail",
                    "type": "action",
                    "implementation": "UserService.checkEmail",
                    "inputs": {
                        "email": "ctx => ctx.activities.CollectUserInfo.outputs.userInfo.email"
                    },
                    "outputs": {
                        "exists": "ctx => ctx.result.exists"
                    }
                }
            ],
            "outputs": {
                "emailOk": {
                    "description": "True if email is not already registered",
                    "fn": "ctx => !ctx.actions[0].outputs.exists"
                }
            }
        },

        "CreateAccount": {
            "description": "Create the user record and send welcome email",
            "triggers": [
                {
                    "type": "event",
                    "event": "ValidateEmail.succeeded",
                    "condition": "ctx => ctx.activities.ValidateEmail.outputs.emailOk"
                }
            ],
            "policy": {
                "executeMode": "wait",
                "retryPolicy": {"maxAttempts": 3, "backoff": "exponential", "initialDelayMs": 200},
                "timeoutMs": 10000,
                "actionsMode": "sequential",
            },
            "actions": [
                {
                    "name": "CreateUserInDb",
                    "type": "action",
                    "inputs": {
                        "email": "ctx => ctx.activities.CollectUserInfo.outputs.userInfo.email",
                        "password": "ctx => ctx.activities.CollectUserInfo.outputs.userInfo.password"
                    },
                    "outputs": {
                        "userId": "ctx => ctx.result.id"
                    },
                    fn: (obj) => { obj.outputs.userId = 12345; return {userId: 12345};}
                },
                {
                    "name": "SendWelcomeEmail",
                    "type": "action",
                    "inputs": {
                        "userId": "ctx => ctx.activities.CreateAccount.actions[0].outputs.userId"
                    },
                    fn: (obj) => { return {userId: 12345};}
                }
            ],
            "outputs": {
                "userId": {
                    "description": "Identifier of the newly created user",
                    "fn": (obj) => { return obj.outputs.userId; }
                }
            }
        }
    }
}