import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(to_addrs, title, body):
    from_addr = "GENERATEYOUREMAIL@ethereal.email"
    login = "GENERATEYOUREMAIL@ethereal.email"
    password = "GENERATEYOURPASSWORD"

    msg = MIMEMultipart()
    msg["from"] = "viagens_confirmar@email.com"
    msg["to"] = ', '.join(to_addrs)

    msg["Subject"] = title
    msg.attach(MIMEText(body, 'html'))

    try:

        server = smtplib.SMTP("smtp.ethereal.email", 587)
        server.starttls()
        server.login(login, password)
        text = msg.as_string()

        for email in to_addrs:
            server.sendmail(from_addr, email, text)

        server.quit()
    except Exception as exception:
        return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }