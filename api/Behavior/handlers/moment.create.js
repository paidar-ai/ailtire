module.exports = {
    name: "moment.create",
    handlers: [	{ description: "This id the default handler and prints event and data to stdout.",
		fn: (data) => {
                    console.log(`Event ${event} contains ${data}`);
                }
	}
]
};