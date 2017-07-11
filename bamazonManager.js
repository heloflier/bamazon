//**********************************************
//**********************************************
//				 BAMAZON  MANAGER
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

let sql = "";

//==========================================
//==========================================
//				Main logic	
//==========================================
//==========================================
 
connection.connect();

promptAction()

//==========================================
//                  ACTION
//==========================================

function promptAction() {

	inquirer
	  .prompt([
	    // Here we create a prompt asking id and
        // number of items for purchase
        {
	      type: "list",
	      message: "Please pick an option",
	      choices: [
	      			"View Products for Sale", 
	      			"View Low Inventory",
					"Add to Inventory",
					"Add New Product"
				   ],
	      name: "option"
	    }
	  ])
	  	.then(function(resp) {
	  		let option = resp.option;
	  		let id = parseInt(resp.productID);
	  		let qty = parseInt(resp.orderQty);

			switch (option) {
					case 'View Products for Sale':
						sql = "SELECT * FROM products";
						displayTable(sql)
						break;

					case 'View Low Inventory':
						sql = "SELECT * FROM products WHERE stock_quantity <= 5";
						displayTable(sql)
						break;

					case 'Add to Inventory':
						addStock();
						break;

					case 'Add New Product':
						addProduct();
			};
			connection.end
		})

}

//==========================================
// displayTable: display the formatted table
//==========================================

function displayTable(sql) {
    connection.query(sql, function (error, results, fields) {
        if (error) {
            return console.log(error);
        }
        //  loop through the rows and fill the table
        results.forEach(makeTable);
        console.log("\n\n");
        console.log(table.toString());
        console.log("\n\n");
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
//  		Add to Inventory
//==========================================
 
function addStock() {
	inquirer
	  .prompt([
	    // Here we create a prompt asking for 
        // details of the increment in stock
	    {
	      type: "input",
	      message: "Please digit the item's ID",
	      name: "productID",
	      validate: isValid
	    },    
	    {
	      type: "input",
	      message: "How many items would you like to add?",
	      name: "addQty",
          validate: isValid
    	}
	  ])
	  	.then(function(resp) {

			let productID = resp.productID;
	  		let addQty = resp.addQty;
	  		let sql = 	"UPDATE products " + 
						"SET stock_quantity = stock_quantity + ? " + 
						"WHERE item_id = ? ";
			let sqlarg = [addQty, productID];

			updateDB(sql, sqlarg);
	  		
		});
};

//==========================================
//  isValid: check for prompt validity
//==========================================

let isValid = (answer) => {
			// we are making sure the response 
			// is a number
	      	if (!isNaN(answer)) {
	      		return true;
	      	}
    	  	else {
    	  	return console.log('\n\n----------------------------------'
    	  						+ '\n     please input a number'
    	  						+ '\n----------------------------------\n\n');
    	  	}
}
//==========================================
//  		Update DB
//==========================================

function updateDB(sql, arg) {
	connection.query(sql, arg, (err, res) => {

    				if (err) throw err;

    				console.log('\n\n----------------------------------'
                    + '\n     operation successful'
                    + '\n----------------------------------\n\n');
				}		
	
	);
};

//==========================================
//  		Add Product
//==========================================
 
function addProduct() {

	inquirer
		.prompt([
			{	
				type: "input",
				message: "please type a product description",
				name: "desc"
			},
			{	
				type: "input",
				message: "please type a price",
				name: "price",
				validate: isValid
			}
		])
		.then(function(resp) {
			let desc = resp.desc;
	  		let price = resp.price;
	  		let sql = 	"INSERT INTO products (product_name, price, stock_quantity)" +
						"VALUES (?, ?, ?)";
			let sqlarg = [desc, price, 0];

			updateDB(sql, sqlarg);
		});
};