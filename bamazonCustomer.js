var inquirer = require("inquirer");
var mysql = require("mysql");
var consoleTable = require("console.table");

//connect to local server in order to access database 
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "cent430Rim$",
	database: "Bamazon"
})

//will display all items available for sale, including the ids, names, and prices..
	connection.query('SELECT * FROM products', function(err, result) {

		//display error if there is one
		if(err) {
			throw err;
		}

		//log inventory result in a table
		console.table(result);
		placeOrder();

	});

//will then prompt users (inquirer) with the following:
	//Ask the ID of the product they want to buy
	//Ask how many units of the product they want to buy
function placeOrder() {
	inquirer.prompt ([
	{
		type: "input",
		name: "itemID",
		message: "What is the ID of the item that you would like to purchase?"
	},
	{
		type: "input",
		name: "quantity",
		message: "How many units would you like to buy?"
	}
	]).then(function(response) {

		//item_id does not start at 0, therefore iD is stored in a variable in order to properly locate the array position
		//both variables are converted into numbers
		var trueID = response.itemID
		var iD = parseInt(trueID) - 1;
		var amount = parseInt(response.quantity);

		connection.query("SELECT * FROM products", function(err, result) {

			var cost = result[iD].price;
			var inStock = result[iD].stock_quantity;
			var stockUpdate = inStock - amount;

			if(inStock === 0 && amount > inStock) {
				console.log("out of stock!")
				placeOrder();

			}
		    else if(amount > inStock) {
				console.log("insufficient quantity");
				placeOrder();
			} 
			else {

				var total = amount * cost

				connection.query("UPDATE products SET ? WHERE ?", [
					{
						stock_quantity: stockUpdate
					}, {
						item_id: trueID
					}
				]);

				console.log("Your purchase total is:  $" + total);

				connection.end();
			}
		});

	});

}


//Once order placed, app will check if store has enough product to meet customer request.
	//IF NOT:  App will log phrase, "insufficient quantity" and prevent order from going through.
	//IF PRODUCT AVAIL:  App will fulfill customer order..
		//This means updated SQL database to reflect remaining quantity
		//Once the update goes through, show customer total cost of their purchase.
