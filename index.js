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
    }
]

inquirer
.prompt(questions)

.then((answers) => {
  switch(answers.options){
    case 'view all departments':
      console.log("view all departments");
      break
    
    case 'view all roles':
      console.log("view all roles");
      return

    case 'view all employees':
      console.log("view all employees");
      return

    case 'add a department':
      console.log("add a department");
      return

    case 'add a role':
      console.log("add a role");
      return
  
    case 'add an employee':
      console.log("add an employee");
      return
    
    case 'update an employee role':
      console.log("update an employee role");
      return

  }
  // fs.writeFile('testing.txt', mm.renderSvg(), function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // });
})

//   inquirer
// .prompt(questions)

// .then((answers) => {

// switch(answers.shape){
//     case 'circle':
//         mm = new Circle(answers.text, answers.text_color, answers.shape_color);
//         break

//     case 'square':
//         mm = new Square(answers.text, answers.text_color, answers.shape_color);
//         break

//     case 'triangle':
//         mm = new Triangle(answers.text, answers.text_color, answers.shape_color);
//         break
// }
