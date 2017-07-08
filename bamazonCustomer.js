//**********************************************
//**********************************************
//				    BAMAZON
//**********************************************
//**********************************************

//==========================================
//	 Modules, dependencies and variables
//==========================================
var inquirer   = require('inquirer');
var mysql      = require('mysql');
var Table = require('cli-table');
var keys	   = require('./keys.js');

//	object needed for the SQL connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : keys.id,
  password : keys.pwd,
  database : keys.db
});

//	creating the table variable for the 
//	table template
var table = new Table({
    head: ['Item ID', 'Product Name', 'Price', 'Quantity'], 
    colWidths: [10, 40, 10, 10]
});

var totalSpent = 0;

//==========================================
//	makeTable:	Form the table for display
//==========================================
 
function makeTable(row) {
  	table.push(
	    [
	     	row.item_id, 
	     	row.product_name, 
	     	row.price, 
	     	row.stock_quantity
	    ]
	);
};

//==========================================
// displayTable: display the formatted table
//==========================================

function displayTable(sql, end) {
	connection.query(sql, function (error, results, fields) {
		if (error) {
			return console.log(error);
		}
		//	loop through the rows and fill the table
		results.forEach(makeTable);
		console.log("\n\n");
		console.log(table.toString());
		console.log("\n\n");
		if (!end) {
			console.log("remember: type 'exit' to end program");
			console.log("------------------------------------\n\n");
			action();
		}
	});
};

//==========================================
//				End Program	
//==========================================
 
function endProgram() {

	console.log('\n\nyour total expense is: $' 
				+ totalSpent + "\n\n");
	setTimeout(function() {
		sql = "SELECT * FROM products"
		var end = true;
		displayTable(sql, end);
		connection.end();
	}, 3000);
}

//==========================================
//				Action	
//==========================================
 
function placeOrder(id, qty) {

	connection.query('SELECT * FROM products WHERE item_id = ?', 
					 [id], (err, res) => {
	        if (err) throw err;

	        console.log(res);
	        console.log(qty);
	        let purchase = parseFloat(res[0].price);
	        let stockQty = res[0].stock_quantity;

	        if (stockQty >= qty) {
	        	stockQty -= qty;

	            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', 
	            	[stockQty, id], (err, res) => {
	                	if (err) throw err;
	                	//	add to total expense        	
	                	// console.log(res);
	                	// console.log(purchase);
	                	// console.log(res[0].price);

	        			totalSpent += (qty * purchase);
	        			console.log(purchase);
	        			console.log(totalSpent);
	        			endProgram();
	            });
	    	};
    });
}

//==========================================
//				Main logic	
//==========================================
 
connection.connect();

var sql = "SELECT * FROM products";

displayTable(sql);
 
//	after the table is displayed, we prompt
//	the user for action
function action() {

	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "To place an order, please digit the item's ID",
	      name: "productID",
	      // validate: function(answers) {
	      // 	if (answers !== NaN) {
	      // 		return true;
	      // 	}
    	  // 	else {
    	  // 		return console.log('please input a number for the ID');
    	  // 	}
    	  // }
	    },    
	    {
	      type: "input",
	      message: "How many items would you like to buy?",
	      name: "orderQty"
    	}
	  ])
	  	.then(function(resp) {
	  		var id = resp.productID;
	  		var qty = resp.orderQty;
	    	// If the action is 'exit' we close the inquirer
	    	// if (id == "exit") {
	    	// 
	    	// }
	    	// else {
	    	// else if (typeof id != 'number') {
	    	// 	console.log('Please input a number')
	    	// 	return
	    	// }

		   //  	connection.query(sql, function (error, results, fields) {
					// if (error) {
					// return console.log(error);
					// }

					//	if not, we then place the order
					//	checking stock availability
			placeOrder(id, qty);
			
				// action();
		});
}
