require("../../models/models")



exports.getIssues = function(req, res){


	issues = Issue.findAll()

	console.log(issues);

	response = {
		data: [
			{
				name: "test1",
				expires: "never",
				amount: "ONE BILLION DOLLARS"
			},
		]
	}

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};