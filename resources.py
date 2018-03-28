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
			
			student = Student.query.filter(Student.student_id == session['student_id']).first()
			course_id = data['course_id']
			course_passcode = data['course_passcode']
			course = Course.query.filter(Course.course_id==course_id).first()
			if(course_passcode == course.passcode):
				course.students.append(student)
				db.session.commit()
			
				return {'message': 'Course registration complete'}
			else: # add to pending courses
				course.pending_students.append(student)
				db.session.commit()
				return {'message': 'Student added to pending students'}
				
class ConfirmCourse(Resource):
	def post(self):
		if not session['instructor_id']:
			return {'err': 'Not an instructor'}
		else:
			data = user_parser.parse_args()
			if(!data["student_id"] or !data["course_id"]):
				return {'err': 'Need student id and course id"}
			student = Student.query.filter(Student.student_id==data["student_id"]).first()
			course = Course.query.filter(Course.course_id==data["course_id"]).first()
			course.students.append(student)
			course.pending_students.remove(student)
			
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