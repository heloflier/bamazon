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
//==========================================
//				Main logic	
//==========================================
//==========================================
 
connection.connect();

var sql = "SELECT * FROM products";

displayTable(sql);

//==========================================
// displayTable: display the formatted table
//==========================================

function displayTable(sql, end) {
    connection.query(sql, function (error, results, fields) {
        if (error) {
            return console.log(error);
        }
        //  loop through the rows and fill the table
        results.forEach(makeTable);
        console.log("\n\n");
        console.log(table.toString());
        console.log("\n\n");

        //  after the table is displayed, we prompt
        //  the user for action if this is not the
        //  end of the program 
        if (!end) {
            action();
        }
    });
};
 
//==========================================
//  makeTable:  Form the table for display
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
//                  ACTION
//==========================================

function action() {

	inquirer
	  .prompt([
	    // Here we create a prompt asking id and
        // number of items for purchase
	    {
	      type: "input",
	      message: "To place an order, please digit the item's ID",
	      name: "productID",
	      validate: function(answer) {
	      	if (!isNaN(answer)) {
	      		return true;
	      	}
    	  	else {
    	  	return console.log('\n\n----------------------------------'
    	  						+ '\n please input a number for the ID'
    	  						+ '\n----------------------------------\n\n');
    	  	}
    	  }
	    },    
	    {
	      type: "input",
	      message: "How many items would you like to buy?",
	      name: "orderQty",
          validate: function(answer) {
            if (!isNaN(answer)) {
                return true;
            }
            else {
            return console.log('\n\n----------------------------------'
                                + '\n please input a number for the qty'
                                + '\n----------------------------------\n\n');
            }
          }
    	}
	  ])
	  	.then(function(resp) {
	  		var id = parseInt(resp.productID);
	  		var qty = parseInt(resp.orderQty);

			//	we then place the order
			//	checking stock availability
			placeOrder(id, qty);
			
				// action();
		});
}

//==========================================
//              Place Order       
//==========================================
 
function placeOrder(id, qty) {

    //  we query to gather the current stock quantity
    connection.query('SELECT * FROM products WHERE item_id = ?', 
                     [id], (err, res) => {
            if (err) throw err;

            let purchase = parseFloat(res[0].price);
            let stockQty = res[0].stock_quantity;
            let totalSales = res[0].product_sales;

            //  if enough stock to cover the purchase,
            //  we update the stock to reflect it,
            //  otherwise we notify the user
            if (stockQty >= qty) {
                stockQty -= qty;
                updateQty(stockQty, id, totalSales, qty, purchase)              
            }
            else {
                console.log('Insufficient Quantity!');
                action();
            }
    });
}

//==========================================
//              Place Order       
//==========================================
 
function updateQty(stockQty, id, prodSales, qty, purchase) {
    //  updating the stock quantity and the total  
    //  product sales to reflect the current purchase

    console.log('qty ', qty);
    console.log('purchase ', purchase);
    let expense = (qty * purchase);
    prodSales += expense;

    console.log('prodSales ', prodSales);

    connection.query('UPDATE products SET stock_quantity = ?, ' + 
                    "product_sales = ? " + 
                    "WHERE item_id = ?", 
                    [stockQty, prodSales, id], (err, res) => {
                        if (err) throw err;

                        endProgram(expense);
                });
}

//==========================================
//              End Program 
//==========================================
 
function endProgram(exp) {

    console.log('\n\nyour total expense is: $' 
                + exp + "\n\n");
    setTimeout(function() {
        sql = "SELECT * FROM products"
        var end = true;
        displayTable(sql, end);
        connection.end();
    }, 3000);
}