var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "AG$my4(4477",
    database: "bamazon"
})

connection.connect(function(err){
    if (err) {
        throw err;
    }
    else {
    console.log("Connection successful!");
    viewTable();
    }
});


var viewTable = function() {
    connection.query("SELECT * FROM products", function(err, response){
    for (var i = 0; i < response.length; i++) {
        console.log(response[i].itemID + " -- " +  response[i].productName + " -- " +
        response[i].departmentName + " -- " +response[i].price + " -- " + response[i].stockQty);
    }
    promptCustomer();
    })
}

var promptCustomer = function(response) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: "Which product you would like to buy? (Press Q to quit)"
    }]).then(function(answer){
        
        // let user press "Q" to quit
        if (answer.choice.toUpperCase() = "Q"){
            process.exit();
        }        
        
        // determine if product is available in database
        var exists = false;
        for (var i = 0; i < response.length; i++){
            if (response[i].productName == answer.choice){
                exists = true;  // product is present
                var product = answer.choice;
                var pID = i;
                inquirer.prompt({
                    type: 'input',
                    name: 'qty',
                    message: 'How many would you like to buy?',
                    validate: function(qtyselected){
                        // make sure input is a number
                        if (isNaN(qtyselected) == false){
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }).then(function(answer2){
                    if (response[pID].stockQty - answer2.qty > 0){
                        
                        //update stock quantity for product
                        var newQty = response[pID].stockQty - answer2.qty;
                        connection.query("UPDATE products SET stockQty='" + newQty +
                        " 'WHERE productName ='" + product + "'", function(err, response2){
                            console.log("Product purchased!");
                            viewTable();
                        });
                    }
                    else {
                        console.log("That product is not available!");
                        promptCustomer(response);
                    }
                })
            }
        }
        if (i == response.length && exists == false){
            console.log("Not a valid selection!");

            promptCustomer(response);
        }
    })
}