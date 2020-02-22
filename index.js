var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");

var connection = mysql.createConnection({

    host: "localhost",

    port: 3306,

    user: "root",

    password: process.env.MYSQL_PASSWORD,

    database: "employee_management_db"

});

connection.connect(function (err) {
    if (err) throw err;
    titleText.then(start())
})


function start() {
    console.log("\n")

    inquirer.prompt({
        type: "list",
        message: "What action would you like perform?",
        name: "actions",
        choices: [
            "Add an Employee",
            "Add a Department",
            "View Employees",
            "View Departments",
            "Change Employee Role",
            // "Add Role"

        ]


    })
        .then(function (res) {
            switch (res.actions) {
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Add a Department":

                    break;
                case "View Employees":

                    break;
                case "View Departments":

                    break;
                case "Change Employee Role":

                    break;
                default:

                    break;
            }
        })
}

const titleText = new Promise(function (resolve, reject) {
    figlet('Employee Tracker', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    })
    console.log("\n")
})



function addEmployee() {
    const roles = []
    const managers = []
    var roleID = ""
    var managerID = ""

    connection.query("SELECT * FROM role;", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title)
        }
    })

    connection.query("SELECT * FROM employee;", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let managerFirst = res[i].first_name
            let managerSecond = res[i].last_name
            managers.push(managerFirst + " " + managerSecond)
        }
    })

    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Please Enter the Employees First Name: "
        },
        {
            name: "lastName",
            type: "input",
            message: "Please Enter the Employees Last Name: "
        },
        {
            name: "role",
            type: "list",
            message: "Please select a role for this Employee. ",
            choices: roles
        },


    ])
        .then(function (response) {
            let role = response.role
            connection.query("SELECT id FROM role WHERE title=?", [role], function (err, res) {
                if (err) throw err;
                roleID = parseInt(res[0].id)
            })
            inquirer.prompt({
                name: "addManager",
                type: "confirm",
                message: "Would you like to add a Manager to this Employee?"
            })
                .then(function (res) {
                    if (res.addManager != true) {
                        connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?);", [response.firstName, response.lastName, roleID], function (err, res) {
                            if (err) throw err;

                            console.log(response.firstName + " " + response.lastName + " has been added!")
                        })
                    }

                    else {
                        inquirer.prompt(
                            {
                                name: "manager",
                                type: "list",
                                message: "Please select a Manager for this Employee. ",
                                choices: managers
                            }
                        )
                            .then(function (res) {
                                let manager = res.manager
                                let managerName = manager.split(" ")
                                connection.query("SELECT id FROM employee WHERE first_name=? AND last_name=?", [managerName[0], managerName[1]], function (err, res) {
                                    if (err) throw err;
                                    managerID = parseInt(res[0].id)

                                    console.log(response.firstName, response.lastName, roleID, managerID)
                                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [response.firstName, response.lastName, roleID, managerID], function (err, res) {
                                        if (err) throw err;

                                        console.log(response.firstName + " " + response.lastName + " has been added!")
                                    })
                                })

                            })
                    }
                })
        })
}

