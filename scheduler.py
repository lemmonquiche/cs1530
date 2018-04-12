from models.models import Course_Registration, Schedule, Group
from sqlalchemy import create_engine
from sqlalchemy.sql import text
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import random
from random import shuffle
import numpy as np
engine = create_engine('sqlite:///grouper.db')


def sumColumn(m, column):
    total = 0
    for row in range(len(m)):
        total += m[row][column]
    return total

def gen_groups(course_id):
    con = engine.connect()
    #get all students from course
    cur_groups = con.execute('SELECT group_id FROM \'group\' WHERE course = :course_id', {'course_id':course_id})
    cur_groups_id = [r for (r, ) in cur_groups]
    for c in cur_groups_id:
        con.execute('DELETE FROM group_membership WHERE group_id = :group', {'group':c})
    con.execute('DELETE FROM \'group\' WHERE course = :course_id', {'course_id':course_id})

    result = con.execute('SELECT student_id FROM course_registration WHERE course_id = :course', {'course':course_id})

    ss = [r for (r, ) in result]

    sched_matrix = np.empty((0, 196), int)
    #print(sched_matrix.shape)

    #get schedules for all students
    con.close()
    con = engine.connect()
    for s in ss:
        result = con.execute('SELECT available_hour_week FROM schedule WHERE schedule_id = :st', {'st':s})
        sched = [r for (r, ) in result]
        if not sched:
            con.close()
            return
        sch = np.array(map(int, sched[0]))
        sched_matrix = np.vstack((sched_matrix, sch))

    #generate groups
    gid = con.execute('SELECT max(group_id) FROM \'group\'')
    group_i = [r for (r, ) in gid]
    if group_i[0] is None:
        group_id = 0
    else:
        group_id = int(group_i[0])

    #if no gid is return, start at 0
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
            con.execute('INSERT INTO \'group\' VALUES(:group, :course)', {'group':group_id, 'course':course_id})

            #initialize values needed to create groups
            i = 0
            snum = 0
            while i < 5 and snum < len(ss):
                #if student is available at time
                if sched_matrix[snum, t] == 1:
                    #get student id: add to database that student is in this group
                    stud = ss[snum]
                    con.execute('INSERT INTO group_membership(student_id, group_id, randomized) VALUES(:student_id, :group_id, :randomized)', {'student_id':stud, 'group_id':group_id, 'randomized':0})

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
            con.execute('INSERT INTO \'group\' VALUES(:group, :course)', {'group':group_id, 'course':course_id})

            #generate the group with first 5 students
            for x in range(0, 5):
                stud = ss[x]
                con.execute('INSERT INTO group_membership(student_id, group_id, randomized) VALUES(:student_id, :group_id, :randomized)', {'student_id':stud, 'group_id':group_id, 'randomized':1})
                #remove student from ss and their schedule from sched_matrix
                ss.remove(stud)
        else:
            #if there is not enough students to form a group
            for stud in ss:
                g = len(groups) - 1
                num = random.randint(0, g)
                group_num = groups[num]
                con.execute('INSERT INTO group_membership(student_id, group_id, randomized) VALUES(:student_id, :group_id, :randomized)', {'student_id':stud, 'group_id':group_id, 'randomized':1})
                ss.remove(stud)
                #somehow indicate group might not be optimal
    con.close()
    for g in groups:
        print("group id: ", g)
    return groups
