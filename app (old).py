from flask import Flask, render_template, request
from flask_mail import Mail, Message
import os
from datetime import datetime

app = Flask(__name__, static_folder='static')
app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'XXXXXXXXXXXX'
app.config['MAIL_PASSWORD'] = 'XXXXXXXXXXXXXXX'
app.config['MAIL_DEFAULT_SENDER'] = 'XXXXXXXXXX'

mail = Mail(app)

# Country mapping
country_mapping = {
    '1': 'Österreich',
    '2': 'Schweiz',
    '3': 'Deutschland',
    '4': 'America',
}

@app.route('/', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['pwd']
        text = request.form['text']
        birthdate = request.form['birthdate']
        country = request.form['Land']

        # Simple form validation: Check if any required field is empty
        if not (name and password and text and birthdate and country):
            error_message = "Please fill out all required fields."
            return render_template('contact.html', error_message=error_message)

        # Convert birthdate string to datetime object
        try:
            birthdate_date = datetime.strptime(birthdate, '%Y-%m-%d')
        except ValueError:
            error_message = "Invalid birthdate format. Please enter a valid date."
            return render_template('contact.html', error_message=error_message)

        # Calculate age
        today = datetime.today()
        age = today.year - birthdate_date.year - ((today.month, today.day) < (birthdate_date.month, birthdate_date.day))

        # Check if age is less than 120
        if age >= 120:
            error_message = "Invalid age. Please enter a valid birthdate."
            return render_template('contact.html', error_message=error_message)

        # Add your processing logic here (e.g., storing data in a database)

        # Replace numerical country value with country name
        country_name = country_mapping.get(country, 'Unknown Country')

        # Save data in a local file
        save_data_locally(name, password, text, birthdate, country)

        # Send an email
        send_email(name, password, text, birthdate, country)

        # Render the confirmation template with the name parameter
        return render_template('confirmation.html', name=name)
    else:
        return render_template('contact.html')


@app.route('/index')
def index():
    return render_template('index.html')


def save_data_locally(name, password, text, birthdate, country):
    now = datetime.now()
    timestamp = now.strftime("%Y%m%d%H%M%S")

    country_name = country_mapping.get(country, 'Unknown Country')

    with open("output.txt", "a") as file:
        file.write(f"Time: {timestamp}\nName: {name}\nPassword: {password}\nText: {text}\nBirthdate: {birthdate}\nCountry: {country_name}\n\n")

def send_email(name, password, text, birthdate, country):
    country_name = country_mapping.get(country, 'Unknown Country')

    msg = Message("Contact Form Submission",
                  sender="XXXXXXXXX@email.com",
                  recipients=["XXXXXXXXX@email.com"])

    msg.body = f"Name: {name}\nPassword: {password}\nText: {text}\nBirthdate: {birthdate}\nCountry: {country_name}"

    mail.send(msg)

if __name__ == '__main__':
    app.run(debug=True)
