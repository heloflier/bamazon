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
    head: ['Item ID', 'Product Name', 'Price', 'Dept.','Quantity'], 
    colWidths: [10, 30, 10, 22, 10]
});

var totalSpent = 0;

//==========================================
//==========================================
//				Main logic	
//==========================================
//==========================================

let sql = "SELECT * FROM products";

let end = false;

connection.connect();

displayTable(sql, end);

//==========================================
// displayTable: display the formatted table
//==========================================

function displayTable(sql, end) {

    connection.query(sql, (err, res) => {
            if (err) throw err;
        
            //  loop through the rows and fill the table
            res.forEach(makeTable);
            console.log("\n\n");
            console.log(table.toString());
            console.log("\n\n");

            //  we need to reinitialize the table or we get duplicates
            //  when we display it again
            table = new Table({
                head: [ 'Item ID', 'Product Name', 
                        'Price', 'Dept.','Quantity'], 
                colWidths: [10, 30, 10, 22, 10]
            });

            //  after the table is displayed, we prompt
            //  the user for action if this is not the
            //  end of the program 
            
            if (!end) {
                action();
            }
            else {
                connection.end();
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
            row.department_name,
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
    	  	return console.log(
                '\n\n----------------------------------'
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
            return console.log(
                '\n\n----------------------------------'
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
                console.log(
                    '\n\n----------------------------------'
                    + '\n     Insufficient Quantity!'
                    + '\n----------------------------------\n\n');
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

    let expense = (qty * purchase);
    prodSales += expense;

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

    console.log('\n\n----------------------------------'
                + '\n your total expense is: $' 
                + exp
                + '\n----------------------------------\n\n');
    setTimeout(function() {
        sql = "SELECT * FROM products"
        let end = true;
        displayTable(sql, end);
    }, 2000);
}