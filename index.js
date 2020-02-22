var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
var cTable = require("console.table")

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


function start() {
    console.log("\n")

    inquirer.prompt({
        type: "list",
        message: "What action would you like perform?",
        name: "actions",
        choices: [
            "Add an Employee",
            "Add a Department",
            "Add a Role",
            "View All Employees",
            "View Departments",
            "Change Employee Role",
            "Exit",

        ]


    })
        .then(function (res) {
            switch (res.actions) {
                case "Add an Employee":
                    addEmployee();
                    break;

                case "Add a Department":
                    addDepartment()
                    break;

                case "Add a Role":
                    addRole()
                    break;

                case "View All Employees":
                    viewEmployees()
                    break;

                case "View Departments":
                    viewDepartments()
                    break;

                case "Change Employee Role":
                    updateRole()
                    break;

                case "Exit":
                    console.log("Thank you for using Employee Tracker!")
                    process.exit()

                default:
                    console.log("Please choose an option.")
                    start()
                    break;
            }
        })
}


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
            message: "Please enter the employees First Name: "
        },
        {
            name: "lastName",
            type: "input",
            message: "Please enter the employees Last Name: "
        },
        {
            name: "role",
            type: "list",
            message: "Please select a role for this employee. ",
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
                message: "Would you like to add a manager to this employee?"
            })
                .then(function (res) {
                    if (res.addManager != true) {
                        connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?);", [response.firstName, response.lastName, roleID], function (err, res) {
                            if (err) throw err;
                            console.log(response.firstName + " " + response.lastName + " has been added!")
                            moreActions()

                        })

                    }

                    else {
                        inquirer.prompt(
                            {
                                name: "manager",
                                type: "list",
                                message: "Please select a manager for this employee. ",
                                choices: managers
                            }
                        )
                            .then(function (res) {
                                let manager = res.manager
                                let managerName = manager.split(" ")
                                connection.query("SELECT id FROM employee WHERE first_name=? AND last_name=?", [managerName[0], managerName[1]], function (err, res) {
                                    if (err) throw err;
                                    managerID = parseInt(res[0].id)

                                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [response.firstName, response.lastName, roleID, managerID], function (err, res) {
                                        if (err) throw err;

                                        console.log(response.firstName + " " + response.lastName + " has been added!")
                                        moreActions()

                                    })
                                })

                            })
                    }
                })
        })
}


function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Please enter the title of the department: "
        })
        .then(function (response) {
            connection.query("INSERT INTO department (name) VALUES (?);", [response.department], function (err, res) {
                if (err) throw err
                console.log(response.department + " has been added!")
                moreActions()
            })
        })
}


function addRole() {
    departments = []
    departmentID = ""

    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].name)
        }
    })

    inquirer
        .prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Please enter the title of the role: "
            },
            {
                name: "roleSalary",
                type: "input",
                message: "Please enter the salary for this role: "
            },
            {
                name: "roleDepartment",
                type: "list",
                message: "Please select a department for this role.",
                choices: departments
            }
        ])
        .then(function (response) {
            let salary = parseFloat(response.roleSalary)
            let selectedDepartment = response.roleDepartment
            console.log(selectedDepartment)
            connection.query("SELECT id FROM department WHERE name=?;", [selectedDepartment], function (err, res) {
                if (err) throw err;
                departmentID = parseInt(res[0].id)
                connection.query("INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?);", [response.roleTitle, salary, departmentID], function (err, res) {
                    if (err) throw err;
                    console.log(response.roleTitle + " has been added!")
                    moreActions()
                })
            })

        })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee;", function (err, res) {
        if (err) throw err
        console.table(res)
        moreActions()
    })
}

function moreActions() {
    inquirer
        .prompt({
            name: "continue",
            type: "confirm",
            message: "Would you like to perform another action?"
        })
        .then(function (res) {
            if (res.continue != true) {
                console.log("Thank you for using Employee Tracker!")
                process.exit()
            }
            else {
                start()
            }
        })
}