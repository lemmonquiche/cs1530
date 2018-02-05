from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Email, Content, Mail

import config


def send_email(email_from, email_to, subject, message):
    sendclnt = SendGridAPIClient(apikey=config.sendgrid_api_key)
    fr_email = Email(email_from)
    to_email = Email(email_to)
    content = Content("text/plain", message)

    mail = Mail(fr_email, subject, to_email, content)
    response = sendclnt.client.mail.send.post(request_body=mail.get())

    # print(response.status_code)
    # print(response.body)
    # print(response.headers)

    return response


def print_settings():
    pass
