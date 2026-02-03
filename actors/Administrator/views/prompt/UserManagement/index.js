module.exports = {
    key: 'admin.userManagement',
    description: 'User management guidance',

    selector: (obj, context, lastResult) => {
        // If user just registered, suggest listing users
        if (lastResult?.contextUpdates?.lastAction === 'register') {
            return [ listUsers ];
        }
        // If user just listed, suggest removing a user
        if (lastResult?.contextUpdates?.lastAction === 'list') {
            return [ removeUser ];
        }
        // Otherwise pick first applicable hint by 'when' filter
        return this.hints.filter(h => {
            return typeof h.when !== 'function' || h.when(context);
        });
    }
};