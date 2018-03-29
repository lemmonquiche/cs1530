from flask import Flask, send_from_directory, redirect, url_for, request, g, render_template, make_response, Blueprint,session
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import os
from models.models import db, RevokedTokenModel, Student, Instructor, Course
from  util.email import  *

engine = create_engine('sqlite:///grouper.db')

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

    con = engine.connect()
    con.execute("""INSERT INTO student
                    VALUES (
                        1,
                        'Testing',
                        'Testing',
                        'test@gmail.com',
                        1,
                        'test',
                        '$pbkdf2-sha256$29000$X6sVIiREaG0NQSjl3BtjzA$WhUNyD7BYxY.fHbbpppVxrj.NRbYm1w1F7LHXb6eavQ'
                    );

                    INSERT INTO student
                    VALUES (
                        2,
                        'Rahimov',
                        'Daler',
                        'daler@gmail.com',
                        1,
                        'username',
                        '$pbkdf2-sha256$29000$uxdCaE3p3TvHOOe8FyIkxA$vRSdCk8XP3BqXAkr18bph.gwTKxte3.ZwdBNHvzhVi4'
                    );

                    INSERT INTO student
                    VALUES (
                        3,
                        'Allicock',
                        'Betteann',
                        'ballicock2@huffingtonpost.com',
                        1,
                        'ballicock2',
                        'ssQlhEMIDB1'
                    );

                    INSERT INTO student
                    VALUES (
                        4,
                        'Keeri',
                        'Lory',
                        'lkeeri3@marriott.com',
                        1,
                        'lkeeri3',
                        'QP8jmAy'
                    );

                    INSERT INTO student
                    VALUES (
                        5,
                        'Solan',
                        'Vanda',
                        'vsolan4@desdev.cn',
                        1,
                        'vsolan4',
                        '9R6ckxgf'
                    );

                    INSERT INTO student
                    VALUES (
                        6,
                        'Craythorn',
                        'Melessa',
                        'mcraythorn5@tinyurl.com',
                        1,
                        'mcraythorn5',
                        'vzQCn0jPQm36'
                    );

                    INSERT INTO student
                    VALUES (
                        7,
                        'Bahls',
                        'Alessandra',
                        'abahls6@sitemeter.com',
                        1,
                        'abahls6',
                        'Bhau7v'
                    );

                    INSERT INTO student
                    VALUES (
                        8,
                        'Pay',
                        'Gizela',
                        'gpay7@webs.com',
                        1,
                        'gpay7',
                        'QIVexD'
                    );

                    INSERT INTO student
                    VALUES (
                        9,
                        'Jirak',
                        'Willamina',
                        'wjirak8@amazon.co.jp',
                        1,
                        'wjirak8',
                        'lPfiO1X5'
                    );

                    INSERT INTO student
                    VALUES (
                        10,
                        'Dimitrescu',
                        'Alberta',
                        'adimitrescu9@sciencedaily.com',
                        1,
                        'adimitrescu9',
                        'Dj1m0281bjv'
                    );

                    INSERT INTO course
                   VALUES (
                       1,
                       'Software Engineering',
                       'joining'
                   );

                    INSERT INTO course_registration (
                                    id,
                                    student_id,
                                    course_id
                                )
                                VALUES (
                                    1,
                                    1,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    2,
                                    2,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    3,
                                    3,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    4,
                                    4,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    5,
                                    5,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    6,
                                    6,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    7,
                                    7,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    8,
                                    8,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    9,
                                    9,
                                    1
                                );

                                INSERT INTO course_registration
                                VALUES (
                                    10,
                                    10,
                                    1
                                );
        INSERT INTO instructor
                       VALUES (
                           1,
                           'daler@gmail.com',
                           'Rahimov',
                           'Daler',
                           0,
                           'prof',
                           '$pbkdf2-sha256$29000$FsI4p7S2du6917q3FqK0tg$xW.BfqRgLLGFWTo9.32dT1BZLfufMFa6pVKk9glk7ps'
                       );

    INSERT INTO instructs_course
                             VALUES (
                                 1,
                                 1
                             );

    INSERT INTO schedule
                     VALUES (
                         1,
                         1,
                         '1100111100011011010000000111000111101001111100011111011010001100100001110011110100011001100101010101010001010101000110111001000011101110011100111111101101110100000010001011101000000111111000011100'
                     );

                     INSERT INTO schedule
                     VALUES (
                         2,
                         2,
                         '1101010110110001101100111011110101000011101101011010010011001110110110011110010000111000111100110000001001000011110110100100001101100100110100011001110110011010110010010011000100000101110110010101'
                     );

                     INSERT INTO schedule
                     VALUES (
                         3,
                         3,
                         '1101110111000111111000110000111010101001011101001111110011101011000010011001000001011001101010111110010011100011111000000100011001011011100111101101011011011001100101100000010001010000101110100011'
                     );

                     INSERT INTO schedule
                     VALUES (
                         4,
                         4,
                         '1001011000110010001101001110110111111100110000000101010011101011011101010101100110010010000000101101010111101010110101100000101010111010000000001110110000010100100101101011100111110100001101001111'
                     );

                     INSERT INTO schedule
                     VALUES (
                         5,
                         5,
                         '1010100100100100001010101000001101111110010110110101110100001001100101111111000011010110101101101001011010001000010000101101001000000101100000101010011011010100100000010101110100010000110001000110'
                     );

                     INSERT INTO schedule
                     VALUES (
                         6,
                         6,
                         '1110011011000011101110110011111001011100001001001011110101010010011010110110000000100001101011110110011010010001110100111110110001011100001101100110110011110011000111001000011011100111011000110000'
                     );

                     INSERT INTO schedule
                     VALUES (
                         7,
                         7,
                         '1100111001110001011000110101000001111101001011010110110100111111011010001010000111100111000111011000011111111000100110110101100100001110000000000010000110100000010100110100010101011101001011100100'
                     );

                     INSERT INTO schedule
                     VALUES (
                         8,
                         8,
                         '1011000101010100011011010111011110111000101010101001001001110010011111110111011100111101111101100000110110000000100111101000100000110110010111111011000111110000111100011111001000000001011111000011'
                     );

                     INSERT INTO schedule
                     VALUES (
                         9,
                         9,
                         '1111100001101000000000101001001101111100011111010100010101110000100010001111001010110111110111001001010011100101000110000110001010000011010010100110110111010001000101111011110000100001000001011100'
                     );

                     INSERT INTO schedule
                     VALUES (
                         10,
                         10,
                         '1010001010000000100011000011011100000101110001110011101100010011000011011101111000111010111100110011100011001111101100110110000101110011111111000011100010000110011001101110000000111111001010011011'
                     );
    """)

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
api.add_resource(resources.Registration, '/api/login/signup')

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
