from flask import Flask, send_from_directory, redirect, url_for, request, g, render_template, make_response, Blueprint,session
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
import os
from models.models import db, RevokedTokenModel, Student, Instructor
from  util.email import  *

engine = create_engine('sqlite:///grouper.db')
metadata = MetaData()

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
api.add_resource(resources.LoginUser,           '/api/login/user')
api.add_resource(resources.LoginCridentials,    '/api/login/credentials')
api.add_resource(resources.Profile,             '/api/profile')
api.add_resource(resources.StudentSchedule,     '/api/student/schedule')
api.add_resource(resources.StudentClasses,      '/api/student/classes/added')
api.add_resource(resources.StudentAddClassCode, '/api/student/classes/addByCode')
api.add_resource(resources.StudentPendingClass, '/api/student/classes/pending')
api.add_resource(resources.Registration,        '/api/login/signup')
api.add_resource(resources.InstructorDashBoard, '/api/instructor/course')
api.add_resource(resources.GroupGenerate,       '/api/instructor/course/generategroup')
api.add_resource(resources.RetrieveGroups,      '/api/instructor/course/groups')
api.add_resource(resources.InstructorAddCourse, '/api/instructor/addCourse')

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

@app.errorhandler(404)
def page_not_found(e):
    if g.student:
        return send_from_directory('student/build', 'index.html')
    if g.instructor:
        return send_from_directory('instructor/build', 'index.html')

    return redirect(url_for('signin'))

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

@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.drop_all()
    db.create_all()
    # add for debuggin
    #new_user = Instructor(
    #    username = 'prof',
#        password = Instructor.generate_hash('password'),
#        lname = 'Rahimov',
#        fname = 'Daler',
#        email = 'daler@gmail.com'
#    )
#    new_user.save_to_db()
#    new_user = Student(
#        username = 'test',
#        password = Instructor.generate_hash('pwd'),
#        lname = 'Testing',
#        fname = 'Testing',
#        email = 'test@gmail.com'
#    )
#    new_user.save_to_db()
#    new_user = Student(
#        username = 'username',
#        password = Student.generate_hash('password'),
#        lname = 'Rahimov',
#        fname = 'Daler',
#        email = 'daler@gmail.com'
#    )
#    new_user.save_to_db()

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
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                    2,
                    'Rahimov',
                    'Daler',
                    'daler@gmail.com',
                    1,
                    'username',
                    '$pbkdf2-sha256$29000$uxdCaE3p3TvHOOe8FyIkxA$vRSdCk8XP3BqXAkr18bph.gwTKxte3.ZwdBNHvzhVi4'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        3,
                        'Allicock',
                        'Betteann',
                        'ballicock2@huffingtonpost.com',
                        1,
                        'ballicock2',
                        'ssQlhEMIDB1'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        4,
                        'Keeri',
                        'Lory',
                        'lkeeri3@marriott.com',
                        1,
                        'lkeeri3',
                        'QP8jmAy'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        5,
                        'Solan',
                        'Vanda',
                        'vsolan4@desdev.cn',
                        1,
                        'vsolan4',
                        '9R6ckxgf'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        6,
                        'Craythorn',
                        'Melessa',
                        'mcraythorn5@tinyurl.com',
                        1,
                        'mcraythorn5',
                        'vzQCn0jPQm36'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        7,
                        'Bahls',
                        'Alessandra',
                        'abahls6@sitemeter.com',
                        1,
                        'abahls6',
                        'Bhau7v'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        8,
                        'Pay',
                        'Gizela',
                        'gpay7@webs.com',
                        1,
                        'gpay7',
                        'QIVexD'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        9,
                        'Jirak',
                        'Willamina',
                        'wjirak8@amazon.co.jp',
                        1,
                        'wjirak8',
                        'lPfiO1X5'
                    );""")
    con.execute("""INSERT INTO student
                    VALUES (
                        10,
                        'Dimitrescu',
                        'Alberta',
                        'adimitrescu9@sciencedaily.com',
                        1,
                        'adimitrescu9',
                        'Dj1m0281bjv'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        11,
                        'Dalli',
                        'Eunice',
                        'edallia@joomla.org',
                        1,
                        'edallia',
                        'qd4JvsWK9T'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        12,
                        'Baddoe',
                        'Charin',
                        'cbaddoeb@netscape.com',
                        1,
                        'cbaddoeb',
                        'UhKsIH8tbps'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        13,
                        'Gilbard',
                        'Dare',
                        'dgilbardc@comcast.net',
                        1,
                        'dgilbardc',
                        '2BpgN3c'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        14,
                        'Pavlata',
                        'Neddie',
                        'npavlatad@surveymonkey.com',
                        1,
                        'npavlatad',
                        'vqQ2KVdn'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        15,
                        'Mathen',
                        'Art',
                        'amathene@so-net.ne.jp',
                        1,
                        'amathene',
                        'JYmik9Z1kL'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        16,
                        'Lalonde',
                        'Donny',
                        'dlalondef@amazonaws.com',
                        1,
                        'dlalondef',
                        '0NIcF6WxKP'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        17,
                        'Bernath',
                        'Estrella',
                        'ebernathg@newyorker.com',
                        1,
                        'ebernathg',
                        'Ml3yNwrraiA'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        18,
                        'Akenhead',
                        'Wilt',
                        'wakenheadh@oakley.com',
                        1,
                        'wakenheadh',
                        'cCyRZNcbgv'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        19,
                        'Domenicone',
                        'Ekaterina',
                        'edomeniconei@dion.ne.jp',
                        1,
                        'edomeniconei',
                        'Aj9PMivo1xYV'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        20,
                        'Eary',
                        'Douglas',
                        'dearyj@marriott.com',
                        1,
                        'dearyj',
                        'ijtkIawW5lw'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        21,
                        'Messruther',
                        'Tish',
                        'tmessrutherk@google.fr',
                        1,
                        'tmessrutherk',
                        'CYxxWQGfyJNb'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        22,
                        'Kinig',
                        'Fianna',
                        'fkinigl@tinypic.com',
                        1,
                        'fkinigl',
                        'F4yOua6'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        23,
                        'Choupin',
                        'Lorie',
                        'lchoupinm@miibeian.gov.cn',
                        1,
                        'lchoupinm',
                        'diSNnGIPnrlI'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        24,
                        'Bodicum',
                        'Christiana',
                        'cbodicumn@github.io',
                        1,
                        'cbodicumn',
                        'weUveAyPGnX'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        25,
                        'Neeson',
                        'Tiebold',
                        'tneesono@npr.org',
                        1,
                        'tneesono',
                        'xnL2dVxV'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        26,
                        'Dancey',
                        'Denver',
                        'ddanceyp@liveinternet.ru',
                        1,
                        'ddanceyp',
                        '64CRzzwlbzRf'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        27,
                        'Bumpass',
                        'Estrellita',
                        'ebumpassq@360.cn',
                        1,
                        'ebumpassq',
                        '7PKSvvS'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        28,
                        'Vandenhoff',
                        'Wenona',
                        'wvandenhoffr@un.org',
                        1,
                        'wvandenhoffr',
                        'LDJoZ4HmTRM'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        29,
                        'Latham',
                        'Eddi',
                        'elathams@mtv.com',
                        1,
                        'elathams',
                        'sQiuFc8D1'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        30,
                        'Pochet',
                        'Inez',
                        'ipochett@studiopress.com',
                        1,
                        'ipochett',
                        'K0FI3o'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        31,
                        'Sterricker',
                        'Dolores',
                        'dsterrickeru@networksolutions.com',
                        1,
                        'dsterrickeru',
                        'E6SlCJXg'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        32,
                        'Kinge',
                        'Gil',
                        'gkingev@webmd.com',
                        1,
                        'gkingev',
                        '4wRfWmZU4TP'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        33,
                        'Adamthwaite',
                        'Norris',
                        'nadamthwaitew@ibm.com',
                        1,
                        'nadamthwaitew',
                        '449D07SdALt'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        34,
                        'Bartolijn',
                        'Remus',
                        'rbartolijnx@eventbrite.com',
                        1,
                        'rbartolijnx',
                        'j8HDX8I0Fl'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        35,
                        'Barthelet',
                        'Hynda',
                        'hbarthelety@examiner.com',
                        1,
                        'hbarthelety',
                        'gc5eRGBUCY'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        36,
                        'Canadine',
                        'Borden',
                        'bcanadinez@scientificamerican.com',
                        1,
                        'bcanadinez',
                        'McEbBZeprr7'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        37,
                        'Jacklings',
                        'Maurita',
                        'mjacklings10@merriam-webster.com',
                        1,
                        'mjacklings10',
                        'z0yMRpnP'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        38,
                        'Lester',
                        'Nerty',
                        'nlester11@phpbb.com',
                        1,
                        'nlester11',
                        'qsjrNb1FI'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        39,
                        'Feaveryear',
                        'Lora',
                        'lfeaveryear12@reverbnation.com',
                        1,
                        'lfeaveryear12',
                        'ajy9Ds8'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        40,
                        'Hawick',
                        'Verene',
                        'vhawick13@tuttocitta.it',
                        1,
                        'vhawick13',
                        'gBjWltjAfiE'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        41,
                        'Bernt',
                        'Bell',
                        'bbernt14@instagram.com',
                        1,
                        'bbernt14',
                        'NydJGP'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        42,
                        'Auden',
                        'Kean',
                        'kauden15@abc.net.au',
                        1,
                        'kauden15',
                        'poeUWe'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        43,
                        'Covey',
                        'Paddie',
                        'pcovey16@blogspot.com',
                        1,
                        'pcovey16',
                        'oEKN6Ew'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        44,
                        'Tabart',
                        'Morna',
                        'mtabart17@behance.net',
                        1,
                        'mtabart17',
                        'yoiYB8'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        45,
                        'Davys',
                        'Arnuad',
                        'adavys18@e-recht24.de',
                        1,
                        'adavys18',
                        'IqjjDo6zP'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        46,
                        'Alldred',
                        'Marleen',
                        'malldred19@reverbnation.com',
                        1,
                        'malldred19',
                        '5RkTnN'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        47,
                        'Youll',
                        'Arnie',
                        'ayoull1a@nhs.uk',
                        1,
                        'ayoull1a',
                        '9SU9G7skLje'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        48,
                        'Ledur',
                        'Hamid',
                        'hledur1b@state.tx.us',
                        1,
                        'hledur1b',
                        '8oU7b0sbP'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        49,
                        'Rahill',
                        'Guntar',
                        'grahill1c@usa.gov',
                        1,
                        'grahill1c',
                        '15XOF4'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        50,
                        'Sheryn',
                        'Sutherland',
                        'ssheryn1d@gmpg.org',
                        1,
                        'ssheryn1d',
                        'NV8c2WWl04G'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        51,
                        'Choke',
                        'Nert',
                        'nchoke1e@army.mil',
                        1,
                        'nchoke1e',
                        'sU2b5H'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        52,
                        'Allaker',
                        'Markus',
                        'mallaker1f@msu.edu',
                        1,
                        'mallaker1f',
                        'LrGzpX'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        53,
                        'McGrouther',
                        'Katalin',
                        'kmcgrouther1g@latimes.com',
                        1,
                        'kmcgrouther1g',
                        'EDj246Cu'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        54,
                        'Andreazzi',
                        'Quintina',
                        'qandreazzi1h@uiuc.edu',
                        1,
                        'qandreazzi1h',
                        'kv9KVK2v0A4L'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        55,
                        'Riatt',
                        'La verne',
                        'lriatt1i@shareasale.com',
                        1,
                        'lriatt1i',
                        'KaFnCXkJPai'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        56,
                        'Wimbridge',
                        'Karlie',
                        'kwimbridge1j@reuters.com',
                        1,
                        'kwimbridge1j',
                        '6kbA6vQU'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        57,
                        'Sinson',
                        'Sena',
                        'ssinson1k@unesco.org',
                        1,
                        'ssinson1k',
                        'gRmSYyMMk'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        58,
                        'Pigny',
                        'Demetris',
                        'dpigny1l@themeforest.net',
                        1,
                        'dpigny1l',
                        '9JK2nbJq'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        59,
                        'Barlas',
                        'Helge',
                        'hbarlas1m@upenn.edu',
                        1,
                        'hbarlas1m',
                        'Sd6z6tTDO'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        60,
                        'Woollett',
                        'Persis',
                        'pwoollett1n@ask.com',
                        1,
                        'pwoollett1n',
                        'rA4fjKGPjrQ'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        61,
                        'Alesi',
                        'Tedman',
                        'talesi1o@sciencedaily.com',
                        1,
                        'talesi1o',
                        'FEZvjRFgR2o'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        62,
                        'Stratiff',
                        'Calhoun',
                        'cstratiff1p@nyu.edu',
                        1,
                        'cstratiff1p',
                        'eTaExml82J'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        63,
                        'Wareing',
                        'Sashenka',
                        'swareing1q@chicagotribune.com',
                        1,
                        'swareing1q',
                        'TfuLGAW'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        64,
                        'Benning',
                        'Ev',
                        'ebenning1r@nasa.gov',
                        1,
                        'ebenning1r',
                        'Z6o9JQ'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        65,
                        'Vasin',
                        'Brittani',
                        'bvasin1s@baidu.com',
                        1,
                        'bvasin1s',
                        'IvyixAX'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        66,
                        'Fitchen',
                        'Niles',
                        'nfitchen1t@amazon.com',
                        1,
                        'nfitchen1t',
                        'sAcrGdlhdhd'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        67,
                        'Janecki',
                        'Rourke',
                        'rjanecki1u@i2i.jp',
                        1,
                        'rjanecki1u',
                        'mMBLUujro'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        68,
                        'Cattermoul',
                        'Chad',
                        'ccattermoul1v@godaddy.com',
                        1,
                        'ccattermoul1v',
                        'QINzKoSdq'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        69,
                        'Ahearne',
                        'Trevor',
                        'tahearne1w@wiley.com',
                        1,
                        'tahearne1w',
                        '4HxRHa'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        70,
                        'Wombwell',
                        'Fania',
                        'fwombwell1x@feedburner.com',
                        1,
                        'fwombwell1x',
                        'Z8CUYCs2'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        71,
                        'Beresfore',
                        'Nolie',
                        'nberesfore1y@youtu.be',
                        1,
                        'nberesfore1y',
                        'uLtMHbG'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        72,
                        'Cohn',
                        'Dael',
                        'dcohn1z@taobao.com',
                        1,
                        'dcohn1z',
                        'ha1xYeERe6AE'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        73,
                        'Birkett',
                        'Freddie',
                        'fbirkett20@over-blog.com',
                        1,
                        'fbirkett20',
                        'yL44lJi5h'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        74,
                        'Dreye',
                        'Tommi',
                        'tdreye21@loc.gov',
                        1,
                        'tdreye21',
                        'qR0pGG'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        75,
                        'Drinkhall',
                        'Hadley',
                        'hdrinkhall22@forbes.com',
                        1,
                        'hdrinkhall22',
                        'ZMRLHtoGQz7'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        76,
                        'Le - Count',
                        'Ayn',
                        'alecount23@imdb.com',
                        1,
                        'alecount23',
                        '3oCjkpqWSY'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        77,
                        'Bridgeman',
                        'Genny',
                        'gbridgeman24@sciencedaily.com',
                        1,
                        'gbridgeman24',
                        'NPr6i8OLLOt1'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        78,
                        'Caslett',
                        'Lilla',
                        'lcaslett25@bigcartel.com',
                        1,
                        'lcaslett25',
                        'Zbq1XDm88ex'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        79,
                        'Priter',
                        'Nikolaus',
                        'npriter26@icio.us',
                        1,
                        'npriter26',
                        'zIJH5Qculn'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        80,
                        'Skitterel',
                        'Valle',
                        'vskitterel27@printfriendly.com',
                        1,
                        'vskitterel27',
                        'DyK7WYbSOELj'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        81,
                        'Bellham',
                        'Jermayne',
                        'jbellham28@mac.com',
                        1,
                        'jbellham28',
                        'a611yuFu'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        82,
                        'Losbie',
                        'Worth',
                        'wlosbie29@ed.gov',
                        1,
                        'wlosbie29',
                        'rZGiF4Pnfne1'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        83,
                        'Nestle',
                        'Jilleen',
                        'jnestle2a@prweb.com',
                        1,
                        'jnestle2a',
                        'A0rhMLXaS'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        84,
                        'Acomb',
                        'Townie',
                        'tacomb2b@yellowpages.com',
                        1,
                        'tacomb2b',
                        'AMLs4oicM9'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        85,
                        'Stack',
                        'Lionello',
                        'lstack2c@ezinearticles.com',
                        1,
                        'lstack2c',
                        'j0iebU1v'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        86,
                        'Gareisr',
                        'Benoit',
                        'bgareisr2d@devhub.com',
                        1,
                        'bgareisr2d',
                        '23tGi0VtgALK'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        87,
                        'Westover',
                        'Loralyn',
                        'lwestover2e@odnoklassniki.ru',
                        1,
                        'lwestover2e',
                        'nocAISdVE'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        88,
                        'Bottomley',
                        'Lauree',
                        'lbottomley2f@nifty.com',
                        1,
                        'lbottomley2f',
                        '9vbUVGN'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        89,
                        'Black',
                        'Randell',
                        'rblack2g@wix.com',
                        1,
                        'rblack2g',
                        'yoSa5yZHt'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        90,
                        'Bickle',
                        'Antonina',
                        'abickle2h@goo.gl',
                        1,
                        'abickle2h',
                        '02DTua'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        91,
                        'Bocock',
                        'Emmott',
                        'ebocock2i@tinyurl.com',
                        1,
                        'ebocock2i',
                        'X2KC8xJ3D9eG'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        92,
                        'Sweetzer',
                        'Riley',
                        'rsweetzer2j@hao123.com',
                        1,
                        'rsweetzer2j',
                        'lMT2ARvz'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        93,
                        'Lambell',
                        'Papagena',
                        'plambell2k@timesonline.co.uk',
                        1,
                        'plambell2k',
                        '8ieEIy7bxz'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        94,
                        'Farrant',
                        'Harcourt',
                        'hfarrant2l@chron.com',
                        1,
                        'hfarrant2l',
                        'uCdfppnXQsQ'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        95,
                        'Dalziel',
                        'Briney',
                        'bdalziel2m@moonfruit.com',
                        1,
                        'bdalziel2m',
                        'g4f8QNuars'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        96,
                        'Schumacher',
                        'Merrill',
                        'mschumacher2n@yolasite.com',
                        1,
                        'mschumacher2n',
                        '6nx9jU6JuJRs'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        97,
                        'Whitebrook',
                        'Gard',
                        'gwhitebrook2o@ihg.com',
                        1,
                        'gwhitebrook2o',
                        'MjXpY83uBqz2'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        98,
                        'Burnhard',
                        'Guy',
                        'gburnhard2p@istockphoto.com',
                        1,
                        'gburnhard2p',
                        'sVkMsTUON3Es'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        99,
                        'Parratt',
                        'Blanch',
                        'bparratt2q@ted.com',
                        1,
                        'bparratt2q',
                        'LvagyGMto'
                    );""")
    con.execute("""INSERT INTO student VALUES (
                        100,
                        'aManger',
                        'Theresa',
                        'tamanger2r@cpanel.net',
                        1,
                        'tamanger2r',
                        'JpvzWVK7RKlh'
                    );""")

    con.execute("""INSERT INTO course
                       VALUES (
                           1,
                           'Software Engineering',
                           'joining'
                       );""")
    con.execute("""INSERT INTO course_registration
                        VALUES (
                            1,
                            1,
                            1
                        );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        2,
                        2,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        3,
                        3,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        4,
                        4,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        5,
                        5,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        6,
                        6,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        7,
                        7,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        8,
                        8,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        9,
                        9,
                        1
                    );""")
    con.execute("""INSERT INTO course_registration
                    VALUES (
                        10,
                        10,
                        1
                    );""")
    con.execute("""INSERT INTO instructor
                   VALUES (
                       1,
                       'daler@gmail.com',
                       'Rahimov',
                       'Daler',
                       0,
                       'prof',
                       '$pbkdf2-sha256$29000$FsI4p7S2du6917q3FqK0tg$xW.BfqRgLLGFWTo9.32dT1BZLfufMFa6pVKk9glk7ps'
                   );""")
    con.execute("""INSERT INTO instructs_course
                                 VALUES (
                                     1,
                                     1
                                 );""")
    con.execute("""INSERT INTO schedule
                     VALUES (
                         1,
                         1,
                         '1100111100011011010000000111000111101001111100011111011010001100100001110011110100011001100101010101010001010101000110111001000011101110011100111111101101110100000010001011101000000111111000011100'
                     );""")
    con.execute("""INSERT INTO schedule
                    VALUES (
                        2,
                        2,
                        '1101010110110001101100111011110101000011101101011010010011001110110110011110010000111000111100110000001001000011110110100100001101100100110100011001110110011010110010010011000100000101110110010101'
                    );""")
    con.execute(""" INSERT INTO schedule
                     VALUES (
                         3,
                         3,
                         '1101110111000111111000110000111010101001011101001111110011101011000010011001000001011001101010111110010011100011111000000100011001011011100111101101011011011001100101100000010001010000101110100011'
                     );
                """)
    con.execute("""INSERT INTO schedule
                    VALUES (
                        4,
                        4,
                        '1001011000110010001101001110110111111100110000000101010011101011011101010101100110010010000000101101010111101010110101100000101010111010000000001110110000010100100101101011100111110100001101001111'
                    );""")
    con.execute(""" INSERT INTO schedule
                     VALUES (
                         5,
                         5,
                         '1010100100100100001010101000001101111110010110110101110100001001100101111111000011010110101101101001011010001000010000101101001000000101100000101010011011010100100000010101110100010000110001000110'
                     );""")
    con.execute("""INSERT INTO schedule
                    VALUES (
                        6,
                        6,
                        '1110011011000011101110110011111001011100001001001011110101010010011010110110000000100001101011110110011010010001110100111110110001011100001101100110110011110011000111001000011011100111011000110000'
                    );""")
    con.execute("""INSERT INTO schedule
                    VALUES (
                        7,
                        7,
                        '1100111001110001011000110101000001111101001011010110110100111111011010001010000111100111000111011000011111111000100110110101100100001110000000000010000110100000010100110100010101011101001011100100'
                    );""")
    con.execute("""INSERT INTO schedule
                    VALUES (
                        8,
                        8,
                        '1011000101010100011011010111011110111000101010101001001001110010011111110111011100111101111101100000110110000000100111101000100000110110010111111011000111110000111100011111001000000001011111000011'
                    );""")
    con.execute("""INSERT INTO schedule
                    VALUES (
                        9,
                        9,
                        '1111100001101000000000101001001101111100011111010100010101110000100010001111001010110111110111001001010011100101000110000110001010000011010010100110110111010001000101111011110000100001000001011100'
    );""")
    con.execute("""INSERT INTO schedule
                    VALUES (
                        10,
                        10,
                        '1010001010000000100011000011011100000101110001110011101100010011000011011101111000111010111100110011100011001111101100110110000101110011111111000011100010000110011001101110000000111111001010011011'
                    );""")
    con.close()
    db.session.commit()
    print('Initialized the database.')

if __name__ == '__main__':
    app.run()
