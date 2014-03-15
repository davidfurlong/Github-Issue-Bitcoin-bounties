<?php 
//require_once('config.inc.php');
?>
<!DOCTYPE html>
<html>
  <head>
    <title>BitBounty</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  
    <script src="js/lib/moment-with-langs.js"></script>
    <script src="js/lib/jquery-2.1.0.min.js"></script>

    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">  

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">

    <!-- Latest compiled and minified JavaScript -->
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
    <link href='http://fonts.googleapis.com/css?family=Lato:300' rel='stylesheet' type='text/css'>
    <link href="styles/style.css" rel="stylesheet">
  
  </head>
  <body>
    <div class="container-fluid">
      <nav class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
          <!-- Brand and toggle get grouped for better mobile display -->
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">BitBounty</a>
          </div>          
          <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav navbar-right">
              <li>
                <button type="submit" class="btn btn-default navbar-btn">Add a Bounty</button>
              </li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div class="row">
        <div class="col-md-1 .col-md-offset-1">
          <a href="index.php">
            <i class="fa fa-angle-left" style="padding-right:5px"></i>Back
          </a>
        </div>
        <div class="col-md-9 .col-md-offset-1">  
          <div class="row" id="add-bounty">
          <!-- PAGE CONTENT START -->
            <form role="form">
              <div class="form-group">
                <label for="exampleInputEmail1">Github Issue URL</label>
                <input type="url" class="form-control" id="exampleInputEmail1" placeholder="Ex. https://github.com/willzeng/WikiNets/issues/169">
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Name of your Organization/Project [Optional]</label>
                <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Ex. ">
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Ex. spurrobot@gmail.com">
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Bounty Amount in Bitcoins</label>
                <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Ex. 0.0314 Bitcoins">
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Bounty Expiration Date [Optional]</label>
                <input type="date" class="form-control" id="exampleInputPassword1" placeholder="">
              </div>
              <div class="checkbox">
                <label>
                  <input type="checkbox"> Only allow contributors to the repository to claim this bounty <!-- TODO ADD HELP QUESTION  MARK -->
                </label>  
              </div>
              <button type="submit" class="btn btn-default">Proceed to Payment</button>
            </form>
            <!-- PAGE CONTENT END -->
          </div>
        </div>
      </div>     
    </div>
  </body>
</html>