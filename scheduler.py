import random
from random import shuffle
import numpy as np
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from models.models import db,  Course_Registration, Student, Schedule, Course
from sqlalchemy.sql import text

def sumColumn(m, column):
    total = 0
    for row in range(len(m)):
        total += m[row][column]
    return total

def gen_groups(course_id):
    #get all students from course
    students = db.session.query(Course_Registration).filter(Course_Registration.course == course_id)

    #make dict
    ss = []
    sched_matrix = []

    #get schedules for all students
    for s in students:
        ss.append(students.student_id)
        #not sure if this query is formated correctly...
        sched = Schedule.bitstring_to_matrix(db.session.query(Schedule).filter(Schedule.schedule_id == s.schedule_id))
        sched_matrix.append(sched)


    #generate groups
    query = text("""SELECT max(group_id) FROM group""")
    group_id = db.execute(query) + 1
    #change
    times = [[i] for i in range(336)]
    shuffle(times)

    for t in times:
        if len(ss) < 5:
            break
        count = sumColumn(sched_matrix, t)
        if count >= 5:
            i = 0
            group = ({"group_id":group_id, "course_id":course_id})
            statement = text("""INSERT INTO group VALUES(:group_id, :course_id)""")
            db.execute(statement)
            while i < 5:
                if check((0, t)) == 1:
                    stud = next(ss)
                    #add to group_membership
                    data = ({"group_id":group_id, "student_id":stud})
                    statement = text("""INSERT INTO group_membership VALUES(:group_id, :course_id)""")
                    db.execute(statement)
                    #remove students in group from ss
                    ss.remove(stud)
                    np.delete(sched_matrix, t, 0)
                else:
                    next(ss)
            group_id += 1


    if not ss:
        for stud in ss:
            group_num.randint(1, group_id)
            data = ({"group_id":group_num, "student_id":stud})
            statement = text("""INSERT INTO group_membership VALUES(:group_id, :course_id)""")
            db.execute(statement)
            #somehow indicate group might not be optimal
