from flask import Flask, send_from_directory, redirect, url_for, request, g
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
import os
from models.models import db, RevokedTokenModel, Student, Instructor
from  util.email import  *

react_app_folder  = 'expert-octo-guacamole/build'
app = Flask(__name__, static_folder=react_app_folder)

api = Api(app)
app.config.update(dict(SEND_FILE_MAX_AGE_DEFAULT=0))

# configuration
DEBUG = True
SECRET_KEY = 'secret_key'

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'grouper.db')

app.config.from_object(__name__)
app.config.from_envvar('CHAT_CONFIG', silent=True)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # to get rid of some warning
db.init_app(app)


@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.drop_all()
    db.create_all()
    # add for debuggin
    new_user = Instructor(
        username = 'prof',
        password = Instructor.generate_hash('password'),
        lname = 'Rahimov',
        fname = 'Daler'
    )
    new_user.save_to_db()
    new_user = Student(
        username = 'username',
        password = Student.generate_hash('password'),
        lname = 'Rahimov',
        fname = 'Daler'
    )
    new_user.save_to_db()
    db.session.commit()
    print('Initialized the database.')


#===============================================================================
# Resource API AUTH
#===============================================================================
api = Api(app)
from  API import resources
from flask_jwt_extended import JWTManager
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)



# @app.before_first_request
# def create_tables():
#     db.create_all()
#     new_user = resources.Student(
#             username = 'username',
#             password = resources.Student.generate_hash('password'),
#             lname = 'Rahimov',
#             fname = 'Daler'
#         )
#     new_user.save_to_db()

api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.SecretResource, '/secret')
api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.LoginUser, '/api/login/user')
api.add_resource(resources.LoginCridentials, '/api/login/credentials')
api.add_resource(resources.GroupGenerate, '/api/group')
app.add_resource(resources.AddSchedule, '/api/schedule/add')

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
    return send_from_directory(react_app_folder, 'index.html')


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


# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     """Logs the user in."""
#     pass


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Registers the user."""
    pass


if __name__ == '__main__':
    app.run()
