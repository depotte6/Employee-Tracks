const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gunn@r123',
    database: 'tracking_db'
  },
  console.log(`You are connected to the tracking_db database.`)
);

db.connect(function (err) {
  if (err) throw err;
  menuPrompt();
});

function menuPrompt() {
  inquirer
    .prompt({
          type: "list",
          message: "What would you like to do?",
          name: "action",
          choices: [
              "VIEW ALL DEPARTMENTS",
              "VIEW ALL ROLES",
              "VIEW ALL EMPLOYEES",
              "ADD A DEPARTMENT",
              "ADD A ROLE",
              "ADD AN EMPLOYEE",
              "UPDATE EMPLOYEE ROLE",
              "EXIT"
          ]
  })

  .then(function({action}) {
          switch (action) {
            case "VIEW ALL DEPARTMENTS": 
            viewAllDepartments();
            break;
          
          case "VIEW ALL ROLES": 
            viewAllRoles();
            break;
          
          case "VIEW ALL EMPLOYEES": 
              viewAllEmployees();
              break;
          
          case "ADD A DEPARTMENT": 
              addADepartment();
              break;
          
          case "ADD A ROLE": 
              addARole();
              break;
          
          case "ADD AN EMPLOYEE": 
              addAnEmployee();
              break;
          
          case "UPDATE EMPLOYEE ROLE": 
            updateEmployeeRole();
              break;
          
          case "EXIT": 
          connection.exit();
          break;
      }
  })

  function viewAllDepartments() {
    console.log("DEPARTMENTS:");
    let query =`SELECT * FROM department`;
      const rows = db.query(query, function(err, rows) {
        if (err) throw err;
        console.table(rows);

        menuPrompt();
      });
  };
  
  function viewAllRoles () {
    console.log("ROLES:");
    let query = `SELECT * FROM roles`;
    const rows = db.query(query, function(err, rows){
      if (err) throw err;
      console.table(rows);

      menuPrompt();
    });
  };

  function viewAllEmployees() {
    console.log("EMPLOYEES:");
    let query = `SELECT * FROM employee`;
    const rows = db.query(query, function(err, rows){
      if (err) throw err;
      console.table(rows);

      menuPrompt();
    });
  };

  function addADepartment() {
    console.log("ADD A DEPARTMENT:");
    let query = `SELECT department.id, department.department_name
    FROM department`
    
    db.query(query, function(err, res) {
      if (err) throw (err);
      const deptChoice = res.map(({ id, department_name}) => ({
        value: id,
        name: `${department_name}`
      }));
      console.table(res);

      promptInsert(deptChoice);
    })
      function promptInsert(deptChoice) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department_name",
              message: "NEW DEPARTMENT NAME:"
            },
          ])
          .then(function(answer) {
            let query = `INSERT INTO department SET?`
            db.query(query, 
              {
                department_name: answer.department_name,
              },
              function(err, res) {
                if(err) throw (err);
                console.table(res);
                menuPrompt();
              });
          });
      }
  };

  function addARole() {
    console.log("ADD A ROLE:");
    let query = `SELECT d.id, d.department_name, r.salary AS budget
      FROM employee e
      JOIN roles r
      ON e.roles_id = r.id
      LEFT JOIN department d
      ON d.id = r.department_id
      GROUP BY d.id, d.department_name`

    db.query(query, function(err, res) {
      if(err) throw (err);
      const chooseDepartment = res.map(({ id, name }) => ({
        value: id, name: `${id} ${name}`
      }));
      console.table(res);
      promptAddARole(chooseDepartment);
      });
        function promptAddARole(chooseDepartment) {
          inquirer
            .prompt([
              {
                type: "input",
                name: "rolesTitle",
                message: "WHAT IS THIS ROLE'S TITLE?"
              },
              {
                type: "input",
                name: "rolesSalary",
                message: "WHAT IS THIS ROLE'S SALARY?"
              },
              {
                type: "list",
                name: "department_id",
                messages: "WHAT IS THIS ROLE'S DEPARTMENT?",
                choices: chooseDepartment
              },
            ])
            .then(function (answer) {
              let query = `INSERT INTO roles SET ?`
              db.query(query, {
                title: answer.rolesTitle,
                salary: answer.rolesSalary,
                department_id: answer.department_id
              },
              function(err, res) {
                if (err) throw (err);

                console.table(res);
                menuPrompt();
              })
            });
        }
  };

  function addAnEmployee() {
    console.log("ADD AN EMPLOYEE:");
    let query = `SELECT roles.id, roles.title, roles.salary
          FROM roles`
              db.query(query, function(err, res) {
                if(err) throw (err);
                const roleChoices = res.map(({id, title, salary}) => ({
                  value: id,
                  title: `${title}`,
                  salary: `${salary}`
                }));
                console.table(res);

                promptInsert(roleChoices);
              });
      function promptInsert(roleChoices) {
                  inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "first_name",
                        message: "EMPLOYEE'S FIRST NAME:"
                      },
                      {
                        type: "input",
                        name: "last_name",
                        message: "EMPLOYEE'S LAST NAME:"
                      },
                      {
                        type: "list",
                        name: "rolesId",
                        message:"EMPLOYEE'S ROLE ID",
                        choices: roleChoices
                      },
                    ])
                    .then(function(answer) {
                      console.log(answer);
                      let query = `INSERT INTO employee SET?`
                      db.query(query, 
                        {
                          first_name: answer.first_name,
                          last_name: answer.last_name,
                          roles_id: answer.rolesId,
                          manager_id: answer.manager_id,
                        },
                        function (err, res) {
                          if (err) throw (err);
                          console.table(res);
                          menuPrompt();
                        });
                    });
      }
  };
}