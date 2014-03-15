require("../../models/models")
var Url = require('url')
var querystring = require('querystring')
var http = require("http")

exports.getIssues = function(req, res){
	Issue.findAll().then(function(qr){
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
	Issue.findAll().then(function(qr){
		if (qr == null){
			res.send(404, "Not found.")
			return
		}

		Bounty.findAll({where: {IssueId: qr.id}}, function(bounties){

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
	valid &= (!!body.amount);
	valid &= (!!body.email);
	valid &= (!!body.expiresAt);
	return valid;
}

exports.addBounty = function(req, res){

	var body = req.body;
	var valid = validateBounty(body);

	if(valid) {
		posturl('/create.php',{},function(wallet) {
			var addprv = wallet.split("\n")

			sequelize.transaction(function(t) {

			issueUrl = body.issueUri;
			issueParts = idFromUrl(issueUrl);
			issueId = issueParts.join("-");

			Issue.findOrCreate(
				{id:issueId}, 
				{
					uri: body.issueUri,
					user: issueParts[0],
					repo: issueParts[1],
					issueName: "Fake issue name.",
					language: "Fake langugage.",
				}, 
				{transaction:t}
			).then(function(issue){
				Bounty.create(
					{
						amount:body.amount, 
						email:body.email, 
						expiresAt:body.expiresAt,
						address:addprv[0],
						privkey:addprv[1],
						confirmedAmount:0
					}, 
					{transaction:t}
				).then(function(bounty){

					res.statusCode=200;
				    res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(bounty));
					t.commit();
				});
			}).catch(function(error){
				console.log(error);
				res.statusCode=500;
				res.send(error);
			});
		});
		}, function(error) {
			console.log(error);
		});
	} else {
		res.send(400, "Invalid bounty.");
	}
}

function idFromUrl(url){
	parts = Url.parse(url).pathname.split('/')
	user = parts[1]
	repo = parts[2]
	issue = parts[4]

	return [user, repo, issue]
}

function posturl(url,params,successcallback,errorcallback){
	var post_data = querystring.stringify(params);

	var options = {
	  hostname: 'btcewallet.cloudapp.net',
	  port: 80,
	  path: "/create.php",
	  method: 'POST',
      headers: {
  		'Content-Type': 'application/x-www-form-urlencoded',
  		'Content-Length': post_data.length
	  }
	};

	var req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    successcallback(chunk);
	  });
	});
	req.on('error', function(e) {
  		errorcallback(e);
	});
	req.write(post_data);
	req.end();
}