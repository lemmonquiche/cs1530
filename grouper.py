from flask import Flask, send_from_directory, redirect, url_for, request

from util.email import send_email as email

app = Flask(__name__, static_folder='react_app/build')


############################################
# Routes
############################################
@app.route('/')
def main_page():
    """ This is the seleton page
    """
    return redirect(url_for('grouper'))


@app.route('/grouper')
def grouper():
    return send_from_directory('react_app/build', 'index.html')


@app.route('/email', methods=['GET'])
def email_get():
    # request.args.success ? "congrats" : ""
    msg = "<p>Congrats, sent!</p>" if request.args.get('success') else ""
    return msg + """
        <form action="/email" method="post">
            <input type="text" name="to"></input>
            <input type="text" name="from"></input>
            <input type="text" name="message"></input>
            <input type="submit"></input>
        </form>
    """


@app.route('/email', methods=['POST'])
def email_post():
    email(request.form.get('from'),
          request.form.get('to'),
          request.form.get('message'))
    return redirect(url_for(email_get.__name__, success=['true']))


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Logs the user in."""
    pass


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Registers the user."""
    pass


if __name__ == '__main__':
    app.run()
