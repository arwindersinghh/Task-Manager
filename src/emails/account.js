const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = "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";

sgMail.setApiKey(sendgridAPIKey);


const getTasksOnly = async (arrOfTasks) => {
    return arrOfTasks.map(({ description, completed }) => {
        return {
            description,
            completed
        }
    })
}

const sendEmail = (email, tasks) => {
sgMail.send({
    to: email,
    from: 'arwinderbryant24@gmail.com',
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