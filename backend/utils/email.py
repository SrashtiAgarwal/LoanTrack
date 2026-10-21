import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_otp_email(receiver_email: str, otp: str):
    sender_email = os.getenv("EMAIL_USER")   # Tumhari Gmail ID (.env mein hogi)
    sender_password = os.getenv("EMAIL_PASS") # Gmail ka App Password (.env mein hoga)

    message = MIMEMultipart("alternative")
    message["Subject"] = "Your Verification OTP"
    message["From"] = sender_email
    message["To"] = receiver_email

    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4F46E5;">Email Verification</h2>
        <p>Hello,</p>
        <p>Your OTP for registration is: <b style="font-size: 22px; color: #111827;">{otp}</b></p>
        <p>This OTP is valid for 5 minutes only.</p>
        <br>
        <p>Regards,<br>Team</p>
      </body>
    </html>
    """

    message.attach(MIMEText(html, "html"))

    try:
        # Gmail ke secure SMTP server se connect karna
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        return True
    except Exception as e:
        print("Email sending error:", e)
        return False