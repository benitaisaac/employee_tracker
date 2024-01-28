const inquirer = require('inquirer');
const fs = require('fs'); 

const questions = [
    {
        type: 'list',
        name: 'options',
        message: 'What shape do you want your logo to be?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role'
        ]
    },
    {
        type: 'input',
        name: 'shape_color',
        message: 'What color do you want the shape to be?',
    }
]


inquirer
  .prompt(questions)
  .then((answers) => {
    fs.writeFile('file.txt', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    // Use user feedback for... whatever!!
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
