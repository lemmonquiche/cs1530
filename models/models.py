import sys
# print (sys.path)
import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256 as sha256
import numpy as np

db = SQLAlchemy()

class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)

instructs_course = db.Table('instructs_course',
    db.Column('instructor_id', db.Integer, db.ForeignKey('instructor.instructor_id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.course_id'))
)


course_pending = db.Table('course_pending',
    db.Column('student_id', db.Integer, db.ForeignKey('student.student_id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.course_id'))
)


class Course_Registration(db.Model):
    __tablename__ = 'course_registration'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'))

    def add(self):
        db.session.add(self)
        db.session.commit()
        
    def __init__(self, student_id, course_id):
        self.student_id = student_id
        self.course_id = course_id

    def __repr__(self):
        return '<Course Registration {}>'.format(self.id)

class Student(db.Model):
    student_id = db.Column(db.Integer, primary_key=True)
    pending_registrations_courses = db.relationship('Course', secondary=course_pending, backref=db.backref("pend_student", lazy="dynamic"))
    course_registrations = db.relationship("Course_Registration", backref="student")
    schedule = db.relationship("Schedule", backref=db.backref("student", uselist=False))
    lname = db.Column(db.Text, nullable=False)
    fname = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False)
    is_reg_confirmed = db.Column(db.Boolean, default=False, nullable=False)

    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)
    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
    
    def serialize(self):
        return {
            'student_id': self.student_id, 
            'username': self.username,
            'lname': self.lname,
            'fname': self.fname,
            'email': self.email,
            'is_reg_confirmed': self.is_reg_confirmed
        }

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'username': x.username,
                'password': x.password
            }
        return {'students': list(map(lambda x: to_json(x), Student.query.all()))}

    def __init__(self, lname, fname, username, password, email, is_reg_confirmed = False, pending_registrations_courses = []):
        for pending in pending_registrations_courses:
            self.pending_registrations_courses.append(pending)

        self.username = username
        self.password = password
        self.lname = lname
        self.fname = fname
        self.email = email
        self.is_reg_confirmed = is_reg_confirmed

    def __repr__(self):
        return '<Student {}>'.format(self.student_id)



class Instructor(db.Model):
    instructor_id = db.Column(db.Integer, primary_key=True)
    courses = db.relationship('Course', secondary=instructs_course, backref=db.backref("instructor", lazy="dynamic"))
    email = db.Column(db.Text, nullable=False)
    lname = db.Column(db.Text, nullable=False)
    fname = db.Column(db.Text, nullable=False)
    is_reg_confirmed = db.Column(db.Boolean, default=False, nullable=False)

    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)
    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'username': x.username,
                'password': x.password
            }
        return {'Instractor': list(map(lambda x: to_json(x), Instructor.query.all()))}

    def __init__(self, lname, fname, email, username, password, is_reg_confirmed = False, courses = []):
        self.lname = lname
        self.fname = fname
        self.email = email
        self.username = username
        self.password = password
        self.is_reg_confirmed = is_reg_confirmed
        for course in courses:
            self.courses.append(course)

    def __repr__(self):
        return '<Instructor {}>'.format(self.instructor_id)

class Schedule(db.Model):
    schedule_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'))
    available_hour_week = db.Column(db.Text, nullable=False)

    @staticmethod
    def matrix_to_bitstring(matrix):
        bitstring = ''.join([''.join(row) for row in matrix])
        return bitstring

    @staticmethod
    def bitstring_to_matrix(bitstring):
        return list(bitstring)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def __init__(self, student_id, available_hour_week):
        self.student_id = student_id
        self.available_hour_week = available_hour_week

    def __repr__(self):
        return '<Schedule {}>'.format(self.schedule_id)

class Group(db.Model):
    group_id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.Integer, db.ForeignKey('course.course_id'))

    def __init__(self, students = []):
        pass

    def __repr__(self):
        return '<Group {}>'.format(self.group_id)

class GroupMembership(db.Model):
    __tablename__ = 'group_membership'
    __table_args__ = {'sqlite_autoincrement': True}

    id = db.Column('id', db.Integer, primary_key = True)
    student_id = db.Column(db.Integer, db.ForeignKey("student.student_id"))
    group_id = db.Column(db.Integer, db.ForeignKey("group.group_id"))
    randomized = db.Column(db.Boolean)
    student = db.relationship(Student, backref="group_membership")
    group = db.relationship(Group, backref="group_membership")

    def __init__(self, student_id, group_id, randomized = 0):
        self.student_id = student_id
        self.group_id = group_id
        self.randomized = randomized

    def __repr__(self):
        return '<Group Membership {}>'.format(self.id)

class Course(db.Model):
    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.Text, nullable=False)
    passcode = db.Column(db.Text, nullable=False)
    groups = db.relationship("Group")
    pending_students = db.relationship('Student', secondary=course_pending, backref=db.backref("pend_course", lazy="dynamic"))
    instructors = db.relationship('Instructor', secondary=instructs_course, backref=db.backref("course", lazy="dynamic"))

    def __init__(self, course_name, passcode, groups = [], pending_students = [], instructors = []):
        self.course_name = course_name
        self.passcode = passcode
        for group in groups:
            self.groups.append(group)
        for student in pending_students:
            self.pending_students.append(student)
        for instructor in instructors:
            self.instructors.append(instructor)



    def __repr__(self):
        return '<Course {}>'.format(self.course_id)
