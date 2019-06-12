const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'donotreply@mail.com',
    subject: 'Welcome!',
    text: `Welcome to the app, ${name}. Enjoy keeping track of your tasks!`
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'donotreply@mail.com',
    subject: 'Goodbye!',
    text: `We are sad to see you go, ${name}. Please come back, if you ever need help tracking your tasks!`
  })
}

module.exports = { sendWelcomeEmail, sendCancellationEmail }
