from flask import Flask, send_from_directory, redirect, url_for, request, g, render_template, make_response, Blueprint,session
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
import os
from models.models import db, RevokedTokenModel, Student, Instructor
from  util.email import  *

app = Flask(__name__)
app.register_blueprint(Blueprint('static_bp', __name__, static_folder='assets', static_url_path=''), url_prefix='/assets')

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
        fname = 'Daler',
        email = 'daler@gmail.com'
    )
    new_user.save_to_db()
    new_user = Student(
        username = 'test',
        password = Instructor.generate_hash('pwd'),
        lname = 'Testing',
        fname = 'Testing',
        email = 'test@gmail.com'
    )
    new_user.save_to_db()
    new_user = Student(
        username = 'username',
        password = Student.generate_hash('password'),
        lname = 'Rahimov',
        fname = 'Daler',
        email = 'daler@gmail.com'
    )
    new_user.save_to_db()
    db.session.commit()
    print('Initialized the database.')

@app.before_request
def before_request():
    g.student = None
    if 'student_id' in session:
        g.student = Student.query.filter_by(student_id=session['student_id']).first()
    g.instructor= None
    if 'instructor_id' in session:
        g.instructor = Instructor.query.filter_by(instructor_id=session['instructor_id']).first()
 
#===============================================================================
# Resource API AUTH
#===============================================================================
api = Api(app)
from  API import resources
from flask_jwt_extended import JWTManager
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)


# api.add_resource(resources.UserLogin, '/login')
# api.add_resource(resources.SecretResource, '/secret')
# api.add_resource(resources.UserLogoutAccess, '/logout/access')
# api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
# api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.LoginUser, '/api/login/user')
api.add_resource(resources.LoginCridentials, '/api/login/credentials')
api.add_resource(resources.GroupGenerate, '/api/group')
api.add_resource(resources.AddSchedule, '/api/schedule/add')

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
    return make_response(render_template('homepage.html'))

@app.route('/signin')
def signin():
    if g.student:
        return redirect(url_for('student'))
    if g.instructor:
        return redirect(url_for('instructor'))    
    return send_from_directory('signin/build', 'index.html')

app.register_blueprint(Blueprint('signin', __name__, static_folder='signin/build/static', static_url_path=''), url_prefix='/signin/static')

@app.route('/student')
def student():
    if not g.student: 
        return redirect(url_for('signin'))
    return send_from_directory('student/build', 'index.html')

app.register_blueprint(Blueprint('student', __name__, static_folder='student/build/static', static_url_path=''), url_prefix='/student/static')

@app.route('/instructor')
def instructor():
    if not g.instructor: 
        return redirect(url_for('signin'))
    return send_from_directory('instructor/build', 'index.html')

app.register_blueprint(Blueprint('instructor', __name__, static_folder='instructor/build/static', static_url_path=''), url_prefix='/instructor/static')


@app.route('/logout')
def logout():
    """Logs the user out."""
    session.pop('student_id', None)
    session.pop('instructor_id', None)
    return redirect(url_for('signin'))
    


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



if __name__ == '__main__':
    app.run()
