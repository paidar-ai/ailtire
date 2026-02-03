module.exports = {
    name: "amoment.create",
    handlers: [{
        description: "After the moment has been created it will be analyzed.",
        fn: (data) => {
            // Put a delay timer in to call the analyze.
            setTimeout(async () => {
                await data.obj.analyze();
            }, 500);
        }
    }
    ]
};