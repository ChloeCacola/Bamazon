//require these packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

//connect to local server in order to access database 
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "cent430Rim$",
	database: "Bamazon"
});

function viewProducts() {
	//access products in Bamazon
	connection.query('SELECT * FROM products', function(err, result) {
		//display error if there is one
		if(err) {
			throw err;
		}
		//log products in a table format
		console.table(result);
		//re-prompt manager
		promptManager();

	});
}

function viewLow() {
	//access products in Bamazon
	connection.query('SELECT * FROM products', function(err, result) {
		//display error if there is one
		if(err) {
			throw err;
		}
		//if there are less than 5 items in stock, display these items.
		for(lowItems in result) {
			if(result[lowItems].stock_quantity < 5) {
				console.table(result[lowItems]);
			}
		}
		//re-prompt manager
		promptManager();
	});
}

function addMore() {
	//get id of item and the amount wishing to be added to stock
	inquirer.prompt([{

			type: "input",
			name: "item",
			message: "Enter the ID of the item you would like to re-stock:"
		},
		{
			type: "input",
			name: "quantity",
			message: "Enter the amount of product being added to current stock:"
		}]).then(function(response) {
			//store ids (one reflecting actual item id, the other is the array position)
			//make the id and response of quantity into numbers
			var trueID = response.item
			var iD = parseInt(trueID) - 1;
			var amount = parseInt(response.quantity);

			//update products with new stock count
			connection.query("SELECT * FROM products", function(err, result) {

			var stockUpdate = amount + result[iD].stock_quantity

				connection.query("UPDATE products SET ? WHERE ?",[
						{
							stock_quantity: stockUpdate
						}, {
							item_id: trueID
						}
					]);
			
			});

			//re-prompt Manager
			promptManager();
		});
}

function addNew() {
	//get all info needed to add new item
	inquirer.prompt([{

		type: "input",
		name: "newitem",
		message: "What item would you like to add?"
	},
	{
		type: "input",
		name: "category",
		message: "What department does this item belong in?"
	},
	{
		type: "input",
		name: "cost",
		message: "How much will the item cost?"
	},
	{
		type: "input",
		name: "quantity",
		message: "How many items would you like to stock?"
	}]).then(function(response) {
		//connect to database to add on based on response
		connection.query("INSERT INTO products SET ?", {
			product_name: response.newitem,
			department_name: response.category,
			price: response.cost,
			stock_quantity: response.quantity
		}, function(err, result) {});
		//let manager know item was added
		console.log("\n___________\nItem added!\n___________\n")
		//re-prompt Manager
		promptManager();
	});

}

function promptManager() {

	//give manager a list of options to choose from
	inquirer.prompt([{
		type: "list",
		name: "action",
		message: "What would you like to do?",
		choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"]
	}]).then(function(response) {
		//match choice with appropriate functions to execute
		switch(response.action) {
			case "View products for sale":
				viewProducts();
				break;

			case "View low inventory":
				viewLow();
				break;

			case "Add to inventory":
				addMore();
				break;

			case "Add new product":
				addNew();
				break;

			case "Exit":
				connection.end();
				break;
			//log error if there is an issue
			default:
				console.log("Error");
		}
	});

}
//when this file is run, promptManager will run right away.
promptManager();