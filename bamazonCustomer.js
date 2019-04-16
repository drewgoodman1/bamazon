var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Brentwood19#",
    database: "bamazon"
})

connection.connect(function(err){
    if(err)throw err;
    console.log("Connection Successfull");
    makeTable();
})

var makeTable = function(){
    connection.query("SELECT * FROM products", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].id + "  " + res[i].product + " || " + res[i].department + " || " + res[i].price + " || "
            + res[i].quantity + "\n"); 
        }
        customerShop(res);
    })
}

var customerShop = function(res){
    inquirer
        .prompt([{
            name: "choice",
            type: "input",
            message: "What would you like to buy? Press Q to quit"
    
        }])
        .then(function(answer){
            var correct = false;
            if(answer.choice.toUpperCase() === "Q"){
                process.exit();
            }
            for(var i=0; i<res.length; i++){
                if(res[i].product === answer.choice){
                    correct = true;
                    var item = answer.choice;
                    var index = i;
                    inquirer
                        .prompt([{
                            name:"units",
                            type:"input",
                            message:"How many units would you like to buy?",
                            validate: function(value){
                                if(isNaN(value)===false){
                                    return true;
                                }else{
                                    return false;
                                }
                            }
                        }])
                        .then(function(answer){
                            if((res[index].quantity - answer.units) > 0){
                                connection.query("UPDATE products SET ? WHERE ?",
                                [
                                  {
                                    quantity: res[index].quantity - answer.units
                                  },
                                  {
                                    product: res[index].product
                                  }
                                ],function(err){
                                    if(err) throw err;
                                    console.log("Purchase completed");
                                    makeTable();

                                }
                                );                   
                            }else{
                                console.log("Not enough inventory");
                                customerShop(res);
                            }
                        })                        
                }
            }
            if(i=res.length && !correct){
                console.log("Product not in inventory");
                customerShop(res);
            }
        });
}

