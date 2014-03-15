$(document).ready(function(){
	
	$('#add-bounty').click(function(){
		document.location.href = "addBounty.html";
	});


	$("#bounty-list").tablesorter({ 
        // define a custom text extraction function 
        textExtraction: function(node) { 
            // extract data from markup and return it
            console.log(x=node) 
            if(node.childNodes.length==2)
            	return node.childNodes[0].innerHTML;
           	return node.innerHTML; 
        } 
    });

});



// filters bounties on search
function filterBounties(){

}