<?php



if(LOCAL) {
	define('DB_NAME', 'GHSpur');
	define('DB_USER', 'root');
	define('DB_PASS', 'root');
} 
else {
	include(PATH.PATH_SEP.'inc/remoteinfo.inc.php');
	if(!REMOTE_USER) define('REMOTE_USER', '');
	if(!REMOTE_PASS) define('REMOTE_PASS', '');

	define('DB_NAME', REMOTE_DB_NAME);
	define('DB_USER', REMOTE_USER);
	define('DB_PASS', REMOTE_PASS);
}

define('DB_HOST', 'localhost');


$MYSQLI_LINK = @mysqli_connect(DB_HOST, DB_USER, DB_PASS);
if(!$MYSQLI_LINK)
	$MYSQLI_LINK = mysqli_connect(DB_HOST, DB_USER, '');

mysqli_select_db($MYSQLI_LINK, DB_NAME);
