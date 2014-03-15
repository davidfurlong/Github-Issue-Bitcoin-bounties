require("../../models/models")
var Url = require('url')


exports.getIssues = function(req, res){


	Issue.findAll().then(function(issues){

		console.log(issues);

		response = {
			data: issues,
		}

	    res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify(response));
	}, function(err){
		res.statusCode=500;
		next(new Error('Issues query failed.'))
	});
};

exports.addBounty = function(req, res){

	issueUrl = req.body.issueUrl;

	issueId = idFromUrl(issueUrl);

	Issue.findOrCreate({id:issueId}, {uri: req.body.issueUri}).then(function(issue){
		Bounty.create({amount:req.body.amount, email:req.body.email, expires:req.body.expires}).then(function(bounty){

			res.statusCode=200;
		    res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(bounty));
		});

	});


}

function idFromUrl(url){
	parts = Url.parse(url).pathname.split('/')
	user = parts[1]
	repo = parts[2]
	issue = parts[4]

	return user+"/"+repo+"/"+issue
}