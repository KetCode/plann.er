def email_template(trip_id, destination, displayedDate, PORT):
    logo_url = "https://raw.githubusercontent.com/KetCode/plann.er/253e045e8eb3513a86571758eb4df2432c4cb5b1/server/src/static/logo.svg"
    icon_url = "https://raw.githubusercontent.com/KetCode/plann.er/253e045e8eb3513a86571758eb4df2432c4cb5b1/server/src/static/icon.svg"

    return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f2f2f2;
                }}
                .email-container {{
                    max-width: 600px;
                    margin: 8px auto;
                    background-color: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background-color: #2d2d2d;
                    padding: 30px;
                    text-align: center;
                }}
                .header img {{
                    max-width: 100px;
                }}
                .content {{
                    padding: 20px 20px 30px;
                    text-align: center;
                }}
                .content h1 {{
                    font-size: 24px;
                    color: #333333;
                }}
                .content p {{
                    font-size: 16px;
                    color: #666666;
                    margin-bottom: 20px;
                }}
                .bold {{
                  font-weight: 600;  
                }}
                .content img {{
                    max-width: 320px;
                    margin-bottom: 20px;
                }}
                .button {{
                    display: inline-block;
                    padding: 15px 30px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #28a745;
                    text-decoration: none;
                    border-radius: 10px;
                }}
                .footer {{
                    background-color: #f2f2f2;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                }}
                .footer a {{
                    color: #666666;
                    text-decoration: none;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="{logo_url}" alt="Logo">
                </div>
                <div class="content">
                    <img src="{icon_url}" alt="Icon">
                    <h1>You’re one click away!</h1>
                    <p>We’re all set to ensure you have a great experience on your trip to <span class="bold">{destination}</span> on <span class="bold">{displayedDate}</span>. Please confirm your trip below:</p>
                    <a href="http://localhost:{PORT}/trips/{trip_id}/confirm" class="button">Confirm trip</a>
                    <br/><br/>
                    <p>If you are unsure what this email is about, please just <u>ignore this email</u>.</p>
                </div>
                <div class="footer">
                    <p>Copyright ©2024 Plann.er</p>
                    <p>Plann.er is owned and operated by KetCode, pending registration number, registered address: Somewhere 14, P.O. Box 777, Nowhere</p>
                    <p>You are receiving this email because you opted in via our app. You can object to receiving further mailings from us by sending an email to <a href="mailto:sac@planner.com">sac@planner.com</a></p>
                    <p>Our <a href="#">Privacy Policy</a></p>
                </div>
            </div>
        </body>
        </html>
    """