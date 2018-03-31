from flask_restful import Resource, reqparse
from flask import g, session, jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from ..models.models import Student, Instructor, RevokedTokenModel
from ..scheduler import *
from sqlalchemy.sql import text
from sqlalchemy import exc
import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
engine = create_engine('sqlite:///grouper.db')
db = engine.connect() 
from json import loads


parser = reqparse.RequestParser()
parser.add_argument('username', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)

user_parser = reqparse.RequestParser()
user_parser.add_argument('username', help = 'This field cannot be blank', required = True)

course_parser = reqparse.RequestParser()
course_parser.add_argument('course_id', help = 'This field cannot be blank', required = True)
course_parser.add_argument('instructor_id', help = 'This field cannot be blank', required = True)

schedule_parser = reqparse.RequestParser()
schedule_parser.add_argument('schedule_id', help = 'This field cannot be blank', required = False)
schedule_parser.add_argument('schedule', help = 'This field cannot be blank', required = True)

registration_parser = reqparse.RequestParser()
registration_parser.add_argument('role', help = 'This field can be blank', required = False)
registration_parser.add_argument('username', help = 'This field cannot be blank', required = True)
registration_parser.add_argument('fname', help = 'This field cannot be blank', required = True)
registration_parser.add_argument('lname', help = 'This field can be blank', required = False)
registration_parser.add_argument('email', help = 'This field cannot be blank', required = True)
registration_parser.add_argument('password', help = 'This field can be blank', required = False)

class Registration(Resource):
    def post(self):
        data = registration_parser.parse_args()
        if not data.role: data.role='student'
        if not data.lname: data.lname = 'dummy'
        if not data.password: data.password = 'password'

        if data.role == 'instructor':
            new_user = Instructor(
                username = data.username,
                password = Instructor.generate_hash(data.password),
                lname = data.lname,
                fname = data.fname,
                email = data.email
            )
            try:
                new_user.save_to_db()
                return {'result': 'success'}
            except exc.IntegrityError:
                return {'err': 'user alredy exit'}

        if data.role == 'student':
            new_user = Student(
                username = data.username,
                password = Instructor.generate_hash(data.password),
                lname = data.lname,
                fname = data.fname,
                email = data.email
            )
            try:
                new_user.save_to_db()
                return {'result': 'success'}
            except exc.IntegrityError:
                return {'err': 'user alredy exit'}

edit_profile_parser = reqparse.RequestParser()
edit_profile_parser.add_argument('username', help = 'This field cannot be blank', required = False)
edit_profile_parser.add_argument('fname', help = 'This field cannot be blank', required = False)
edit_profile_parser.add_argument('lname', help = 'This field can be blank', required = False)
edit_profile_parser.add_argument('email', help = 'This field cannot be blank', required = False)
edit_profile_parser.add_argument('password', help = 'This field can be blank', required = False)

class Profile(Resource):
    def get (self):
        if session['student_id']:
            u = Student.query.filter_by(student_id=session['student_id']).first()
            return {
                'username': u.username
                , 'fname' : u.fname
                , 'lname' : u.lname
                , 'email' : u.email
                , 'password': Student.generate_hash(u.password)
                }
        elif session['instructor_id']:
            u = Instructor.query.filter_by(student_id=session['instructor_id']).first()
            return {
                'username': u.username
                , 'fname' : u.fname
                , 'lname' : u.lname
                , 'email' : u.email
                , 'password': Student.generate_hash(u.password)
                }
        else:
            return { 'err': 'not logged in'}
        
    def post(self):
        data = edit_profile_parser.parse_args()
        
        if (not session['student_id'] and not session['instructor_id']):
            return {'err': 'not logged in'}
        
        if session['student_id']:
            s = Student.query.filter_by(student_id = session['student_id']).first()
            if data.fname: s.fname = data.fname
            if data.lname: s.lname = data.lname
            if data.email: s.email = data.email
            if data.password: s.password= Student.generate_hash(data.password)
            try:
                s.save_to_db()
                return {'result': 'success'}
            except exc.IntegrityError:
                return {'err': 'user alredy exit'}
            
        if session['instructor_id']:
            s = Instructor.query.filter_by(student_id = session['instructor_id']).first()
            if data.fname: s.fname = data.fname
            if data.lname: s.lname = data.lname
            if data.email: s.email = data.email
            if data.password: s.password= Instructor.generate_hash(data.password)
            try:
                s.save_to_db()
                return {'result': 'success'}
            except exc.IntegrityError:
                return {'err': 'user alredy exit'}

                        
class GroupGenerate(Resource):
    def post(self):
        data = course_parser.parse_args()
        cid = data['course_id']
        iid = data['instructor_id']
        if not iid:
            return{'err':'Not an instructor'}
        elif iid:
            # #cid = course_parser.parse_args()
            groups = gen_groups(cid)

            if not groups:
                return{'err':'could not generate group'}
            row_json = json.dumps(groups)
            # jgroups = "\"group_ids\": ["
            # for g in groups:
            #     jgroups += " \"{}\",".format(g)
            # jgroups = jgroups[:-1]
            # jgroups += "]"
            # # return {jgroups}

            return {"group_ids": row_json}
        else:
            return{'err':'could not generate group'}


class StudentSchedule(Resource):
    def get(self):
        # return{'err': 'Not a student', 'sid': str(session['student_id'])}
        if not session['student_id']:
            return{'err': 'Not a student'}
        else:
            s = Schedule.query.filter_by(student_id = session['student_id']).first()
            if not s: 
                s = Schedule (
                    student_id = session['student_id'],
                    available_hour_week = ''
                )
                s.save_to_db()
                return {'schedule':''}
            return {'schedule': s.available_hour_week}
               
    def post(self):
        if not session['student_id']:
            return{'err': 'Not a student'}
        else:
            s_id = Schedule.query.filter_by(student_id = session['student_id']).first()
            if s_id:
                data = schedule_parser.parse_args()
                sched = Schedule.matrix_to_bitstring(loads(data['schedule']))
                statement = text("UPDATE schedule SET available_hour_week='{}' WHERE student_id='{}'".format(sched, session['student_id']))
                db.execute(statement)
                return{'result':'success'}
            else:
                data = schedule_parser.parse_args()
                schedule = Schedule.matrix_to_bitstring(loads(data['schedule']))
                s = Schedule (
                        student_id = session['student_id'],
                        available_hour_week = schedule
                    )
                s.save_to_db()
                return{'result':'success'}
        return {'err': 'Failed for some reason' }

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
        ## student and instruct table have unique username cross table
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

class SearchCourse(Resource):
	def post(self):
		data = user_parser.parse_args()
		if not session['student_id']:
			return {'err': 'Not a student'}
		else:
			course_id = data['course_id']
			course_name = data['course_name']
			instructor_name = data['instructor_name']
			if(course_id != None):
				courses = Course.query.filter(Course.course_id==course_id).all()
				course_list =[]
				for course in courses:
					course_dict ={}
					course_dict["course_id"] = course.course_id
					course_dict["course_name"] = course.course_name
					course_dict["course_passcode"] = course.passcode
					instructor_list = []
					for instructor in course.instructors:
						instructor_dict = {}
						instructor_dict["name"] = instructor.fname + " " + instructor.lname
						instructor_dict["email"] = instructor.email
						instructor_list.append(instructor_dict)
					course_dict["instructors"] = instructor_list
					course_list.append(course_dict)
				return course_list

			elif(course_name != None and instructor_name != None):
				instructor_split = instructor_name.split(" ")
				instructor_fname = instructor_split[0]
				instructor_lname = instructor_split[1]
				courses = Course.query.filter(and_(Course.course_name==course_name,
											  and_(Course.instructors.any(Instructor.fname == instructor_fname),
											   Course.instructors.any(Instructor.lname == instructor_lname)))).all()
				course_list =[]
				for course in courses:
					course_dict ={}
					course_dict["course_id"] = course.course_id
					course_dict["course_name"] = course.course_name
					course_dict["course_passcode"] = course.passcode
					instructor_list = []
					for instructor in course.instructors:
						instructor_dict = {}
						instructor_dict["name"] = instructor.fname + " " + instructor.lname
						instructor_dict["email"] = instructor.email
						instructor_list.append(instructor_dict)
					course_dict["instructors"] = instructor_list
					course_list.append(course_dict)
				return course_list

			elif(course_name != None): 
				courses = Course.query.filter(Course.course_name == course_name).all()
				course_list =[]
				for course in courses:
					course_dict ={}
					course_dict["course_id"] = course.course_id
					course_dict["course_name"] = course.course_name
					course_dict["course_passcode"] = course.passcode
					instructor_list = []
					for instructor in course.instructors:
						instructor_dict = {}
						instructor_dict["name"] = instructor.fname + " " + instructor.lname
						instructor_dict["email"] = instructor.email
						instructor_list.append(instructor_dict)
					course_dict["instructors"] = instructor_list
					course_list.append(course_dict)
				return course_list

			elif(instructor_name != None):
				instructor_split = instructor_name.split(" ")
				instructor_fname = instructor_split[0]
				instructor_lname = instructor_split[1]
				courses = Course.query.filter(and_(Course.instructors.any(Instructor.fname == instructor_fname),
											   Course.instructors.any(Instructor.lname == instructor_lname))).all()
				course_list =[]
				for course in courses:
					course_dict ={}
					course_dict["course_id"] = course.course_id
					course_dict["course_name"] = course.course_name
					course_dict["course_passcode"] = course.passcode
					instructor_list = []
					for instructor in course.instructors:
						instructor_dict = {}
						instructor_dict["name"] = instructor.fname + " " + instructor.lname
						instructor_dict["email"] = instructor.email
						instructor_list.append(instructor_dict)
					course_dict["instructors"] = instructor_list
					course_list.append(course_dict)
				return course_list
			else:
				return {'err':'Please provide search parameters'}