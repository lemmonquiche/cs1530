from flask_restful import Resource, reqparse
from flask import g, session, jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from ..models.models import Student, Instructor, RevokedTokenModel
from ..scheduler import *
from sqlalchemy.sql import
from __future__ import print_function # In python 2.7
import json
import sys

parser = reqparse.RequestParser()
parser.add_argument('username', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)

user_parser = reqparse.RequestParser()
user_parser.add_argument('username', help = 'This field cannot be blank', required = True)

course_parser = reqparse.RequestParser()
course_parser.add_argument('course_id', help = 'This field cannot be blank', required = True)
course_parser.add_argument('instructor_id', help = 'This field cannot be blank', required = True)

schedule_parser = reqparse.RequestParser()
schedule_parser.add_argument('schedule_id', help = 'This field cannot be blank', required = True)
schedule_parser.add_argument('schedule', help = 'This field cannot be blank', required = True)

registration_parser = reqparse.RequestParser()
registration_parser.add_argument('user_type', help = 'This field cannot be blank', required = True)
registration_parser.add_argument('', help = 'This field cannot be blank', required = True)

class Registration(Resource):
    def post(self):
        pass
#           this.post('/api/login/signup', function (request) {
#     console.log("API CALL: /api/login/signup");
#     var body = JSON.parse(request.requestBody);
#     var email = body.email;
#     console.log("New User", body.username);
#
#     return new Promise((resolve, reject) => {
#       setTimeout(function() {
#         resolve([200, null, JSON.stringify({ msg: 'Emailed ' + email })]);
#       }, 400);
#     });
#   });

#change instructor id parser back to session['instructor_id'] after testing
class GroupGenerate(Resource):
    def post(self):
        data = course_parser.parse_args()
        cid = data['course_id']
        iid = data['instructor_id']
        if not iid:
            return{'err':'Not an instructor'}
        elif iid:
            #cid = course_parser.parse_args()
            groups = gen_groups(cid)
            print(groups, file=sys.stderr)
            json.dumps(groups)
#            jgroups = ""
#            for g in groups:
#                jgroups += jsonify(g)
            return {groups}
        else:
            return{'err':'could not generate group'}

class AddSchedule(Resource):
    def post(self):
        if not session['student_id']:
            return{'err': 'Not a student'}
        else:
            data = schedule_parser.parse_args()
            course = data['schedule_id']
            schedule = data['schedule']

            sched = Schedule.matrix_to_bitstring(schedule)

            s = ({"schedule_id":sched})
            statement = text("""UPDATE schedule SET available_hour_week=:schedule WHER schedule_id=:schedule_id""")
            db.execute(statement)

            #update/insert
            return{'test':'testing'}

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
                    'message': 'Logged in as {}'.format(current_student.username),
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

class StudentDashBoard(Resource):
    def get(self):
        if not session['student_id']:
            return{'err':'Not a student'}
        else:
            student = Student.query.filter(Student.student_id==session['student_id']).first()
            group_membership = GroupMembership.query.filter(GroupMembership.student_id==student.student_id).all()
            groups = []
            for group_record in group_membership:
                groups.append(Group.query.filter(Group.group_id==group_record.group_id).first())
            group_info = []
            #schedule_id = []
            #schedule_availability = []
            for group in groups:
                print(group.course)
                info_dict = {}
                course = Course.query.filter(Course.course_id == group.course).first()
                info_dict["course_name"] = course.course_name
                info_dict["id"] = group.group_id
                group_membership_holder = GroupMembership.query.filter(GroupMembership.group_id == group.group_id).all()
                group_members = []
                for membership in group_membership_holder:
                    member_dict = {}
                    group_member = Student.query.filter(Student.student_id == membership.student_id).first()
                    member_dict["name"] = group_member.fname + " " + group_member.lname
                    member_dict["email"] = group_member.email
                    group_members.append(member_dict)
                info_dict["members"] = group_members
                group_info.append(info_dict)
            return group_info

class InstructorDashBoard(Resource):
    def get(self):
        if not session['instructor_id']:
            return {'err':'Not an instructor'}
        else:
            courses = Course.query.filter(Course.instructors.any(instructor_id=session['instructor_id'])).all()
            instructor_info_dicts = []
            for course in courses:
                info_dict = {}
                info_dict["course_name"] = course.course_name
                info_dict["course_id"] = course.course_id
                pending_students = []
                for student in course.pending_students:
                    student_dict = {}
                    student_dict["name"] = student.fname + " " + student.lname
                    student_dict["id"] = student.student_id
                    pending_students.append(student_dict)
                info_dict["pending_students"] = pending_students
                instructor_info_dicts.append(info_dict)
            return instructor_info_dicts

class RegisterForCourse(Resource):
    def post(self):
        data = user_parser.parse_args()
        if not session['student_id']:
            return {'err': 'Not a student'}
        else:

            course_id = data['course_id']
            course_passcode = data['course_passcode']

            if(course_passcode == course.passcode):
                course_registration = Course_Registration(data["student_id"], data["course_id"])

                db.session.add(course_registration)
                db.session.commit()

                return {'message': 'Course registration complete'}
            else: # add to pending courses
                student = Student.query.filter(Student.student_id == session['student_id']).first()
                course = Course.query.filter(Course.course_id==course_id).first()

                course.pending_students.append(student)
                db.session.commit()
                return {'message': 'Student added to pending students'}

class ConfirmCourse(Resource):
    def post(self):
        if not session['instructor_id']:
            return {'err': 'Not an instructor'}
        else:
            data = user_parser.parse_args()
            if(data["student_id"]==None or data["course_id"]==None):
                return {'err': 'Need student id and course id'}

            course_registration = Course_Registration(data["student_id"], data["course_id"])
            course.pending_students.remove(student)

            db.session.add(course_registration)
            db.session.commit()

            return {'message': 'Course confirmation complete'}

class CreateCourse(Resource):
    def post(self):
        data = user_parser.parse_args()
        if not session['instructor_id']:
            return {'err': 'Not an instructor'}
        else:
            course_name = data['course_name']
            course_passcode = data['course_passcode']
            if(course_name == None or course_passcode == None):
                return {'err': 'Need course name or course passcode.'}
            instructor = Instructor.query.filter(Instructor.instructor_id == session['instructor_id']).first()
            course = Course(course_name, course_passcode, instructors = [instructor])

            db.session.add(course)
            db.session.commit()

            return{'message':'Course creation complete'}
