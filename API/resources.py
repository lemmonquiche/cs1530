from flask_restful import Resource, reqparse
from flask import g, session
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from ..models.models import Student, Instructor, RevokedTokenModel

parser = reqparse.RequestParser()
parser.add_argument('username', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)

user_parser = reqparse.RequestParser()
user_parser.add_argument('username', help = 'This field cannot be blank', required = True)

class GroupGenerate(Resource):
    def post(self):
        return {'test': 'testing'}

class LoginUser(Resource):
    def post(self):
        data = user_parser.parse_args()
        current_student = Student.find_by_username(data['username'])
        current_instruc = Instructor.find_by_username(data['username'])
        if current_student:
            return {
                'username': data['username'],
                'name' : current_student.fname
                }
        elif current_instruc:
            return {
                'username': data['username'],
                'name' : current_instruc.fname
                }
        else:
            return {'err' : 'User not recongnized'}




class LoginCridentials (Resource):
    def post(self):
        data = parser.parse_args()
        ## studnet and instruct table have unique username cross table
        current_student = Student.find_by_username(data['username'])
        current_instruc = Instructor.find_by_username(data['username'])

        if (not current_student and not current_instruc):
            return {'err': 'User {} doesn\'t exist'.format(data['username']) }
        if current_student:
            if Student.verify_hash(data['password'], current_student.password):
                session['student_id'] = current_student.student_id
#                 print (current_student.student_id)
                return {
                    'message': 'Logged in as {}'.format(current_user.username),
                    'user_type': '{}'.format(type(current_student).__name__),
                    'student_id': '{}'.format(current_student.student_id)
                    }
            else:
                return {'message': 'Wrong credentials',
                        'err' : 'Incorrect Password'}
        elif current_instruc:
            if Student.verify_hash(data['password'], current_instruc.password):
                session['instructor_id'] = current_instruc.instructor_id
#                 print (current_student.student_id)
                return {
                    'message': 'Logged in as {}'.format(current_instruc.username),
                    'user_type': '{}'.format(type(current_instruc).__name__),
                    'instructor_id': '{}'.format(current_instruc.instructor_id)
                    }
            else:
                return {'message': 'Wrong credentials',
                        'err' : 'Incorrect Password'}


class UserLogin(Resource):
    def post(self):
        data = parser.parse_args()
        current_user = Student.find_by_username(data['username'])
        if not current_user:
            current_user = Instructor.find_by_username(data['username'])

        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}

        if Student.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'Logged in as {}'.format(current_user.username),
                'user_type': '{}'.format(type(current_user).__name__),
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        else:
            return {'message': 'Wrong credentials'}

class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}

class SecretResource(Resource):
    try:
        @jwt_required
        def get(self):
            return {
                'secretMsg': "You are logged in :-)"
            }
    except Exception as e:
        print (e)
