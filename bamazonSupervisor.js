//**********************************************
//**********************************************
//			  BAMAZON  SUPERVISOR
//**********************************************
//**********************************************

//==========================================
//	 Modules, dependencies and variables
//==========================================
var inquirer  	= require('inquirer');
var mysql      	= require('mysql');
var Table 		= require('cli-table');
var keys		= require('./keys.js');

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
    head: [	
    		'Dept ID', 
    		'Department Name', 
    		'Overhead', 
    		'Sales', 
    		'Total Profit'
    	  ], 
    colWidths: [9, 32, 12, 12, 14]
});

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
	      			"View Product Sales by Department", 
	      			"Create New Department"
				   ],
	      name: "option"
	    }
	  ])
	  	.then(function(resp) {
	  		let option = resp.option;

			switch (option) {
					case 'View Product Sales by Department':
						displayTable()
						break;

					case 'Create New Department':
						addDept();
			};
		})
}

//==========================================
// displayTable: display the formatted table
//==========================================

function displayTable() {

	let sql = (	"SELECT departments.department_id, " +
						"products.department_name, " +
						"departments.overhead_costs, " +
						"SUM(products.product_sales) " +
							"AS 'Total_Sales', " +
						"(departments.overhead_costs - 'Total_Sales') " +
							"AS 'Total_Profit' " +
				"FROM products " +
				"INNER JOIN departments " +
				"ON products.department_name = departments.department_name " +
				"GROUP BY products.department_name;");

    connection.query(sql, function (error, results, fields) {
        if (error) {
            return console.log(error);
        }
        //  loop through the rows and fill the table
        results.forEach(makeTable);
        console.log("\n\n");
        console.log(table.toString());
        console.log("\n\n");

        connection.end();
    });
};
 
//==========================================
//  makeTable:  Form the table for display
//==========================================
 
function makeTable(row) {
    table.push(
        [
            row.department_id, 
            row.department_name, 
            row.overhead_costs,
            row.Total_Sales,
            row.Total_Profit
        ]
    );
};

//==========================================
// 			Add a new Department
//==========================================

function addDept() {
	inquirer
		.prompt ([
			{
				type: "input",
				message: "Please input the new department's name",
				name: "deptName"
			},
			{
				type: "input",
				message: "Please input an Overhead Cost",
				name: "deptCost"
			}
		])
		.then(function(resp) {
			let deptName = resp.deptName;
			let deptCost = parseFloat(resp.deptCost);

			let sql = 	"INSERT INTO departments " + 
						"(department_name, overhead_costs)" + 
						"VALUES (?, ?);";
			let arg = 	[deptName, deptCost];

			connection.query(sql, arg, (err, res) => {
					if (err) throw err;

    				connection.end();
    				console.log('\n\n----------------------------------'
                    + '\n     operation successful'
                    + '\n----------------------------------\n\n');		
			})
		});
}