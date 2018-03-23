
import random
import numpy as np
from collections import OrderedDict
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from models.models import db,  Course_Registration, Student, Schedule, Course

def sumColumn(m, column):
    total = 0
    for row in range(len(m)):
        total += m[row][column]
    return total

def gen_groups(course_id):
    #get all students from course
    students = db.session.query(Course_Registration).filter(Course_Registration.course == course_id)

    #make dict
    ss = OrderedDict()
    sched_matrix = []

    #get schedules for all students
    for s in students:
        #not sure if this query is formated correctly...
        sched = Schedule.bitstring_to_matrix(db.session.query(Schedule).filter(Schedule.schedule_id == s.schedule_id))
        ss[s.student_id] = sched
        sched_matrix.append(sched)


    #generate groups
    group_id = 1
    #change with actual time possibilities
    for t in trange(20):
        count = sumColumn(sched_matrix, t)
        if count >= 5:
            i = 0
            while i < 5:
                key = d.next()
                check = ss[key]
                if check((0, t)) == 1:
                    #add to student, groups, courses?
                    #remove students in group from ss
                    del ss[key]
                    np.delete(sched_matrix, t, 0)
            group_id += 1

    if not ss:
        for stud in ss:
            group_num.randint(1, group_id)
            #input student into group
            #somehow indicate group might not be optimal
