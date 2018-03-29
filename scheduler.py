import random
from random import shuffle
import numpy as np
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from models.models import db,  Course_Registration, Student, Schedule, Course, Group
from sqlalchemy.sql import text

def sumColumn(m, column):
    total = 0
    for row in range(len(m)):
        total += m[row][column]
    return total

def gen_groups(course_id):
    #get all students from course
    students = db.session.query(Course_Registration).filter(Course_Registration.course_id == course_id)

    #make dict
    ss = []
    sched_matrix = []

    #get schedules for all students
    for s in students:
        ss.append(s.student_id)
        #not sure if this query is formated correctly...
        sched = Schedule.bitstring_to_matrix(db.session.query(Schedule).filter(Schedule.student_id == s.student_id))
        sched_matrix.append(sched)


    #generate groups
    query = text("""SELECT max(group_id) FROM 'group' group by course""")
    group_id = db.engine.execute(query)
    groups = []

    #random list of values for possible times
    times = [[i] for i in range(196)]
    shuffle(times)

    #for each groupable time
    for t in times:
        #break if there is not enough students left to form a group
        if len(ss) < 5:
            break

        #check if there is enough students to create a group at a given time
        count = sumColumn(sched_matrix, t)

        #if groupable
        if count >= 5:
            #generate new group information, append to groups, and add to database
            group_id += 1
            groups.append(group_id)
            group = ({"group_id":group_id, "course_id":course_id})
            statement = text("""INSERT INTO 'group' VALUES(:group_id, :course_id)""")
            db.engine.execute(statement)

            #initialize values needed to create groups
            i = 0
            snum = 0
            while i < 5 and snum < len(ss):
                #if student is available at time
                if sched_matrix[snum, t] == 1:
                    #get student id: add to database that student is in this group
                    stud = ss[snum]
                    data = ({"group_id":group_id, "student_id":stud})
                    statement = text("""INSERT INTO group_membership VALUES(:group_id, :student_id)""")
                    db.engineself.execute(statement)

                    #remove student from ss and their schedule from sched_matrix
                    ss.remove(stud)
                    np.delete(sched_matrix, t, 0)
                    i += 1
                else:
                    #if student not groupable, go to next student
                    snum += 1

    #if there are students leftover
    while ss:
        if len(ss) >= 5:
            #just make these students into a group
            #generate new group information, append to groups, and add to database
            group_id += 1
            groups.append(group_id)
            group = ({"group_id":group_id, "course_id":course_id})
            statement = text("""INSERT INTO 'group' VALUES(:group_id, :course_id)""")
            db.engine.execute(statement)

            #generate the group with first 5 students
            for x in range(0, 5):
                stud = ss[x]
                data = ({"group_id":group_id, "student_id":stud})
                statement = text("""INSERT INTO group_membership VALUES(:group_id, :student_id)""")
                db.engine.execute(statement)

                #remove student from ss and their schedule from sched_matrix
                ss.remove(stud)
                np.delete(sched_matrix, t, 0)

        else:
            #if there is not enough students to form a group
            for stud in ss:
                num.randint(0, len(groups))
                group_num = groups[num]
                data = ({"group_id":group_num, "student_id":stud})
                statement = text("""INSERT INTO group_membership VALUES(:group_id, :student_id)""")
                db.engine.execute(statement)
                #somehow indicate group might not be optimal

    return groups
