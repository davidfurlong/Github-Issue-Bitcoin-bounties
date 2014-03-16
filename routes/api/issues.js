require("../../models/models")
var Url = require('url')
var querystring = require('querystring')
var http = require("http")
var Request = require("request")
var Queue = require("queue-async")

exports.getIssues = function(req, res){
	searchQuery = {}
	for (var key in req.query){
		if (key in Issue.rawAttributes)
			searchQuery[key] = req.query[key]
	}

	Issue.findAll({where: searchQuery}).then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}

		response = {
			data: qr,
		}

	    res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify(response));
	}, function(err){
		res.statusCode=500; 
		next(new Error('Issues query failed.'))
	});
};

exports.getIssueBounties = function(req, res){
	Issue.find(req.params.issueId[0]).then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}

		Bounty.findAll({where: {IssueId: qr.id}}).then(function(bounties){

			response = {
				data: bounties,
			}

		    res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify(response));
		});
	});
};

exports.getIssue = function(req, res){
	Issue.find(req.params.issueId[0]).then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}

		response = {
			data: qr,
		};

	    res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify(response));
	}, function(err){
		res.statusCode=500;
		next(new Error('Issue query failed.'))
	});
}


exports.getBounties = function(req, res){
	Bounty.findAll().then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}

		response = {
			data: qr,
		};

	    res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify(response));

	}, function(err){
		res.statusCode=500;
		next(new Error('Bounties query failed.'))
	});
}

exports.getBounty = function(req, res){
	Bounty.find(req.params.bountyId[0]).then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}

		response = {
			data: qr,
		};

	    res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify(response));

	}, function(err){
		res.statusCode=500;
		next(new Error('Bounty query failed.'))
	});
}


function validateBounty(body){
	//TODO
	var valid = true;
	valid &= (!!body.issueUri);
	valid &= (!!body.email);
	valid &= (!!body.expiresAt);
	return valid;
}

exports.addBounty = function(req, res){

	var body = req.body;
	var valid = validateBounty(body);

	if(valid) {

		issueUrl = body.issueUri;
		issueParts = idFromUrl(issueUrl);
		issueStrId = issueParts.join("/");

		Queue()
			.defer(getGithubIssue, issueParts)
			.defer(getGithubRepo, issueParts)
			.defer(posturl, '/create.php', {})
			.await(function(error, issue, repo, wallet){
				if(error){
					console.log(error);
					res.statusCode=500;
					res.send(error);
					return;
				}
				var addprv = wallet.split("\n")
				sequelize.transaction(function(t) {
					Issue.findOrCreate(
						{strid:issueStrId}, 
						{
							strid: issueStrId,
							uri: body.issueUri,
							user: issueParts[0],
							repo: issueParts[1],
							issueName: issue.title,
							language: repo.language?repo.language:"Unknown",
							confirmedAmount:0,
							amount:0,
						}, 
						{transaction:t}
					).then(function(issue){
						Bounty.create(
							{
								amount:0, 
								email:body.email, 
								expiresAt:body.expiresAt,
								address:addprv[0],
								privkey:addprv[1],
								confirmedAmount:0,
								IssueId: issue.id
							}, 
							{transaction:t}
						).then(function(bounty){
							res.statusCode=200;
						    res.setHeader('Content-Type', 'application/json');

						    response = {
						    	"bounty": bounty,
						    	"issue": issue,
						    	"address": bounty.address
						    };

							res.end(JSON.stringify(response));
							t.commit();
						}).catch(function(error) {
								console.log(error);
								res.statusCode=500;
								res.send(error);
								return;
						});
					}).catch(function(error){
						console.log(error);
						res.statusCode=500;
						res.send(error);
					});
				});
		});
				//End of Queue.
	} else {
		res.send(400, "Invalid bounty.");
	}
}

exports.listtransactions = function(req, res){
	Transactions.findAll().then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}

		response = {
			data: qr,
		};

	    res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify(response));

	}, function(err){
		res.statusCode=500;
		next(new Error('Transactions query failed.'))
	});
}

exports.transactions = function(req, res){
try
{ 
	var body = req.body;
	sequelize.transaction(function(t) {
		Bounty.find(
			{ where: { address:body.recieveAddress} },
			{transaction:t}
			).then(function(qr){
			if (qr == null){
				res.send(404, "Error, corresponding bounty not found.")
				return
			}
			
			Issue.find(qr.IssueId, {transaction:t}).then(function(qr2){
				if (qr2 == null){
					res.send(404, "Error, corresponding Issue not found.")
					return
				}
				qr2.amount = (new Number(qr2.amount) + new Number(body.amount)).toString();
				qr2.save({transaction:t});
			});

			qr.amount = (new Number(qr.amount) + new Number(body.amount)).toString();
			qr.save({transaction:t});
			Transactions.create(
			{
				amount:body.amount, 
				confirmed:0,
				txid:body.txid,
				BountyId:qr.id,
				txbtid:(body.txid + qr.id)
			}, function(error) {
				console.log(error);
				res.statusCode=500;
				res.send(error);
				return;
			}, 
			{transaction:t}
			).then(function(bounty){ 
				res.statusCode=200;
			    res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(bounty));
				t.commit();
			},function(error) {
							console.log(error);
							res.statusCode=500;
							res.send(error);
							return;
			});
		})
	});
}
catch(err)
{
	console.log(error);
	res.statusCode=500;
	res.send(error);
}
}

exports.block = function(req, res){
	var body = req.body;
	Transactions.findAll(
		{ where: { confirmed:false} }
		).then(function(qr){
		if (qr == null){
			res.send(200, "No data")
			return
		}
		qr.forEach(function(i, tra, a){
			console.log("Tra: " + tra)
			console.log("txid" + tra.txid)

			posturl("/confirms.php",{txid:tra.txid}, function(error,conf) {
				console.log("------------ Conf: " + conf)
				if(isInt(conf) && conf > 1) {
					console.log(" IS CONF!")
					sequelize.transaction(function(t) {
						tra.confirmed = true
						tra.save({transaction:t});

						Bounty.find(tra.BountyId,
						{transaction:t}
						).then(function(qr2){
							if (qr2 == null){
								res.send(404, "Error, corresponding bounty not found.")
								return
							}
							qr2.confirmedAmount = (new Number(qr2.amount) + new Number(tra.amount)).toString();
							qr2.save({transaction:t});

							Issue.find(qr2.IssueId, {transaction:t}).then(function(qr3){
								if (qr3 == null){
									res.send(404, "Error, corresponding Issue not found.")
									return
								}
								qr3.amount = (new Number(qr3.amount) + new Number(tra.amount)).toString();
								qr3.save({transaction:t});
								t.commit();
							});	
						})
					});
				}
			});
		})
		res.send(200, "Success");
	});
}

function isInt(value) { 
    return !isNaN(parseInt(value,10)) && (parseFloat(value,10) == parseInt(value,10)); 
}

function idFromUrl(url){
	parts = Url.parse(url).pathname.split('/')
	user = parts[1]
	repo = parts[2]
	issue = parts[4]

	return [user, repo, issue]
}

function posturl(url,params,callback){
	var post_data = querystring.stringify(params);
	console.log("-------------------------------")
	console.log("Post: " + post_data);

	var options = {
	  hostname: 'btcewallet.cloudapp.net',
	  port: 80,
	  path: url,
	  method: 'POST',
      headers: {
  		'Content-Type': 'application/json',
  		'Content-Length': post_data.length
	  }
	};

	var req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    callback(null, chunk);
	  });
	});
	req.on('error', function(e) {
  		callback(e, null);
	});
	req.write(post_data);
	req.end();
}

if(process.env.GITHUB_TOKEN)
	var github_auth = new Buffer(process.env.GITHUB_TOKEN).toString('base64');

var github_options = {
		json: true,
		headers: {
			"User-Agent": "EdShaw/gitspur",
			// "Accept": "application/vnd.github.v3+json",
		},
	}

if (github_auth) {
	github_options.headers["Authorization"] = "Basic " + github_auth;
}

console.log(github_options.headers["Authorization"]);

var extend = require('util')._extend;

function commentOnGithubIssue(issueParts, comment, callback){
	var url = 'https://api.github.com/repos/' + issueParts[0] + "/" + issueParts[1] + '/issues/' + issueParts[2] + "/comments";
	var comment = JSON.stringify({"body": comment});

	var options = extend({}, github_options);
	options["body"] = comment;

	var req = Request.post(url,  options, function(err, res, body) {
		if (!err & (res.statusCode<400) & (res.statusCode>=200)) {
			callback(err, body)
		} else {			
			console.log("Error: "+err);
			callback("Comment Failure");
		}
	});
}

function getGithubIssue(issueParts, callback){
	var url = 'https://api.github.com/repos/' + issueParts[0] + "/" + issueParts[1] + '/issues/' + issueParts[2];
	var req = Request.get(url, github_options, function(err, res, body) {

		if (!err & res.statusCode <400 & res.statusCode>=200) {
			callback(err, body);
		} else {
			console.log("Error: "+err);
			callback("Issue Failure")
		}
	});
}

function getGithubRepo(issueParts, callback){
	var url ='https://api.github.com/repos/' + issueParts[0] + "/" + issueParts[1];
	var req = Request.get(url, github_options, function(err, res, body) {
		if (!err & res.statusCode <400 & res.statusCode>=200) {
			callback(err, body);
		} else {
			console.log("Error: "+err);
			callback("Bounty Failure")
		}
	});
}