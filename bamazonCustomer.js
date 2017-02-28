//require these packages
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
});

//will display all items available for sale and their specifications 
connection.query('SELECT * FROM products', function(err, result) {

	//display error if there is one
	if(err) {
		throw err;
	}
	//log products in a table
	console.table(result);
	placeOrder();

});


//User prompted to type ID of the product they want to buy
//User prompted to type how many units of the product they want to buy
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

		//item_id does not start at 0, therefore iD is stored in a variable in order to properly locate its position
		//both id and amount are converted into numbers
		var trueID = response.itemID
		var iD = parseInt(trueID) - 1;
		var amount = parseInt(response.quantity);

		connection.query("SELECT * FROM products", function(err, result) {

			var cost = result[iD].price;
			var inStock = result[iD].stock_quantity;
			var stockUpdate = inStock - amount;

			//check if item is in stock
			if(inStock === 0 && amount > inStock) {
				console.log("out of stock!")
				//without being able to fulfill an order, placeOrder will run again.
				placeOrder();

			}
			//check if there is sufficient quantity of item for requested amount
		    else if(amount > inStock) {
				console.log("insufficient quantity");
				//without being able to fulfill an order, placeOrder will run again.
				placeOrder();
			} 
			else {
				//calculate the total of the bill
				var total = amount * cost

				//update the database
				connection.query("UPDATE products SET ? WHERE ?", [
					{
						stock_quantity: stockUpdate
					}, {
						item_id: trueID
					}
				]);

				//tell customer their total.
				console.log("Your purchase total is:  $" + total);

				//end the connection.
				connection.end();
			}
		});

	});

}
