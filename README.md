# bamazon

Completed 3 node modules:
- BAMAZONCUSTOMER.JS
- BAMAZONMANAGER.JS
- BAMAZONSUPERVISOR.JS

The modules are developed in a logical and progressive manner to introduce a user to our node application.

It starts with a simple interface which shows the current table of products for sale and prompts the user for a purchase. Afterwards it shows the total spent; after a short delay, the same table with the change in stock quantity reflected.

The following module has more choices: the basic two show the current stock and the low-quantity items, which we can replenish with the third choice. We can also add a new product by digiting a name and a price. 

The last module includes a view of the departments, with data relative to sales and profits. We can also create a new department.
This involved creating a new MySQL table and constructing a more elaborate query to interact with both tables to interpolate new values.


Technology used:
- Cli-table npm module
- Created package.json for easy download and use
- Used a separate 'keys' module for privacy, to be sent directly to recipient before use
- Except for bamazoncustomer.js, introduced the query selections and their arguments separately
  	for ease of maintenance and future development
- Grouped tasks in reusable functions

- Video demo at https://www.youtube.com/watch?v=HwBG5vUa4W0&feature=youtu.be



FUTURE IMPROVEMENTS:

- It should be possible to further consolidate the code 
- Parts common to all modules can be taken out and put into their own module 
  	to avoid repetition
- A main module can be developed to group all 3 modules into one easy to use program
	 by using inquirer to select one of 3 users at the beginning 