
import random
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from models.models import db,  Course_Registration, Student, Schedule, Course

def gen_groups(course_id):
    #get all students from course
    students = db.session.query(Course_Registration).filter(Course_Registration.course == course_id)

    #make dict
    ss = {}

    #get schedules for all students
    for s in students:
        #not sure if this query is formated correctly...
        sched = students = db.session.query(Schedule).filter(Schedule.schedule_id == s.schedule_id)
        ss.update({s.student_id:sched})

    #generate groups
    group_id = 1
    #change with actual time possibilities
    for t in trange(20):
        count = #somehow get count for time
        if count >= 5:
            #generate groups of first 5
            #add to student, groups, courses?
            #remove students in group from ss
            group_id += 1

    if not ss:
        for stud in ss:
            group_num.randint(1, group_id)
            #input student into group
            #somehow indicate group might not be optimal
