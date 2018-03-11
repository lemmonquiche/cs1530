from flask import Flask, send_from_directory, redirect, url_for, request
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from  util.email import  *

app = Flask(__name__, static_folder='react_app/build')


#===============================================================================
# Resource API AUTH
#===============================================================================

app = Flask(__name__)
api = Api(app)
db = SQLAlchemy(app)

from  API import resources
from models import models 
from flask_jwt_extended import JWTManager
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)



@app.before_first_request
def create_tables():
    db.create_all()
    new_user = resources.StudentModel(
            username = 'username',
            password = resources.StudentModel.generate_hash('password')
        )   
    new_user.save_to_db()

api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.SecretResource, '/secret')
api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')

app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedTokenModel.is_jti_blacklisted(jti)

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
    send_email(email_from=request.form.get('from'),
          email_to=request.form.get('to'),
          subject="This is a default subject",
          message=request.form.get('message'))
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
