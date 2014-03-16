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

exports.claimBounty = function(req, res){
	var uri = "https://github.com/login/oauth/authorize?client_id=" + 
		process.env.GITHUBID + "&redirect_uri=https://git-spur.herokuapp.com/oauth/callback?issueId=" + req.query.issueId;
	res.redirect(uri);
}

exports.claimBountyCallback = function(req, res){
	var options = {
		json:true,
		body:{
			client_id: process.env.GITHUBID,
			client_secret: process.env.GITHUBSECRET,
			code: req.query.code,
		},
	}

	var issueId = req.query.issueId;

	console.log(options);

	Request.post("https://github.com/login/oauth/access_token", options, function(err, response, body){
		console.log("ACCESS TOKEN! " + body.access_token)
		Issue.find(issueId).then(function(issue){
			oauth = body.access_token
			repoRequest = {json:true, headers: {"User-Agent": "EdShaw/gitspur",}, body:{"Authorization":"token "+oauth}};
			issueNumber = issue.strid.split("/")[2];
			url = "https://api.github.com/repos/" + issue.user + "/" + issue.repo + "/issues/" + issueNumber;
			console.log(url)
			Request.get(url, repoRequest, function(err, response, issue){
				console.log("Status: " + issue.state);
				if(issue.state == "closed"){
					req.redirect("")
				}
			});
		})
	});

	res.send(500, "Shit")
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
				} else if (issue.state != "open"){
					console.log("Issue state: " + issue.state)
					res.statusCode=400;
					res.send("Issue already closed.")
				}
				var addprv = wallet.split("\n");

				var date = new Date(body.expiresAt);
				if(date instanceof Date && !isNaN(date.valueOf())){
					//Date is a date :)
				} else {
					date=null;
				}
				console.log(date)
				sequelize.transaction(function(t) {
					Issue.findOrCreate(
						{strid:issueStrId}, 
						{
							strid: issueStrId,
							uri: body.issueUri,
							user: issueParts[0],
							repo: issueParts[1],
							issueNumber: issueParts[2],
							issueName: issue.title,
							language: repo.language?repo.language:"Unknown",
							expiresAt: body.expiresAt,
							confirmedAmount:0,
							amount:0,
							payoutToken:randomString(32,'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
						}, 
						{transaction:t}
					).then(function(issue){

						issue.expiresAt = new Date(Math.max.apply(null,[issue.expiresAt, date]))
						issue.save();

						Bounty.create(
							{
								amount:0, 
								email:body.email, 
								expiresAt:body.expiresAt,
								address:addprv[0],
								privkey:addprv[1],
								confirmedAmount:0,
								IssueId: issue.id,
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
		res.send(400, "Invalid parameters.");
	}
}

exports.listtransactions = function(req, res){
	Transactions.findAll().then(function(qr){
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
		qr.forEach(function(tra, i, a){
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
							}console.log("-----------------")
							qr2.confirmedAmount = (new Number(qr2.confirmedAmount) + new Number(tra.amount)).toString();
							qr2.save({transaction:t});

							Issue.find(qr2.IssueId, {transaction:t}).then(function(qr3){
								if (qr3 == null){
									res.send(404, "Error, corresponding Issue not found.")
									return
								}
								commentOnGithubIssue([qr3.user,qr3.repo,qr3.uri.substring(qr3.uri.lastIndexOf('/') + 1)], "A new bounty of " + (tra.amount / 100000000).toString() + "BTC has been added for this issue! View all bounties at: http://davidfurlong.github.io/Spur/issue.html?id=" + qr3.id, function(a,b) { })
								qr3.confirmedAmount = (new Number(qr3.confirmedAmount) + new Number(tra.amount)).toString();
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

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
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
  		'Content-Type': 'application/x-www-form-urlencoded',
  		'Content-Length': post_data.length
	  },
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

exports.payout = function(req, res){
	Issue.find({where: {payoutToken: req.body.payoutToken}}).then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}
		if (qr.payedOut){
			res.send(200, "Already payed out.")
			return
		}
		qr.payedOut = true;
		qr.save();
		Bounty.findAll({where: {IssueId:qr.id}}).then(function(qr2){
			if (qr2 == null){
				res.send(200, "No data")
				return
			}
			allpriv = "";
			qr2.forEach(function(tra, i, a){
				allpriv += tra.privkey + ","
			})
			allpriv = allpriv.substring(0, allpriv.length - 1);
			console.log("~~~~~~~~~~~~~~~~~")
			console.log(allpriv)
			console.log(req.body.to)
			posturl('/sendall.php', {privkeys:allpriv, to:req.body.to})
			res.send(200, "Done")
		});
	});
}

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
			callback("GitHub Issue Failure")
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
			callback("GitHub Bounty Failure")
		}
	});
}