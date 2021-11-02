const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const getTasksOnly = async (arrOfTasks) => {
    return arrOfTasks.map(({ description, completed }) => {
        return {
            description,
            completed
        }
    })
}

const sendEmail = (email, tasks) => {
    console.log(email);
sgMail.send({
    to: email,
    from: 'sender@email.com',
    subject: "Your tasks to do today",    
    html: `<div> ${tasks.map((task) => {
        return `<div> <h1> ${task.description} </h1> <h3> Completed : ${task.completed} </h3></div>`
    })}</div>`
}).then(() => {
    console.log("This worked")
  })
  .catch((error) => {
    console.error(error)
  })
}



module.exports = {
    sendEmail,
    getTasksOnly 
}