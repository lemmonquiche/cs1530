import sendgrid
import os

from sendgrid.helpers.mail import Email, Content, Mail

def send_email(email_from, email_to, message):
  sg         = sendgrid.SendGridAPIClient(apikey='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')
  from_email = Email(email_from)
  to_email   = Email(email_to)
  subject    = "Sending with SendGrid is Fun"
  content    = Content("text/plain", message)
  mail       = Mail(from_email, subject, to_email, content)
  response   = sg.client.mail.send.post(request_body=mail.get())
  print(response.status_code)
  print(response.body)
  print(response.headers)

  return response
