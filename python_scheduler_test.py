from models.models import Course_Registration, Schedule, Group
from sqlalchemy import create_engine
from sqlalchemy.sql import text
engine = create_engine('sqlite:///grouper.db')
con = engine.connect()

def sumColumn(m, column):
    total = 0
    for row in range(len(m)):
        total += m[row][column]
    return total

def gen_groups(course_id):
    #get all students from course
    ss = con.execute('SELECT student_id FROM course_registration WHERE course_id = :course', {'course':course_id})

    sched_matrix = []

    #get schedules for all students
    for s in ss:
        #not sure if this query is formated correctly...
        sched = Schedule.bitstring_to_matrix(con.execute('SELECT available_hour_week FROM schedule WHERE student_id = :stud', {'stud':s}))
        sched_matrix.append(sched)


    #generate groups
    group_id = con.execute('SELECT max(group_id) FROM 'group' group by course')
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
            con.execute('INSERT INTO \'group\' VALUES(:group, :course)', {'group':group_id, ':course':course_id})

            #initialize values needed to create groups
            i = 0
            snum = 0
            while i < 5 and snum < len(ss):
                #if student is available at time
                if sched_matrix[snum, t] == 1:
                    #get student id: add to database that student is in this group
                    stud = ss[snum]
                    con.execute('INSERT INTO group_membership VALUES(:group_id, :student_id)', {'group_id':group_id, 'student_id':stud})

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
            con.execute('INSERT INTO \'group\' VALUES(:group, :course)', {'group':group_id, ':course':course_id})

            #generate the group with first 5 students
            for x in range(0, 5):
                stud = ss[x]
                con.execute('INSERT INTO group_membership VALUES(:group_id, :student_id)', {'group_id':group_id, 'student_id':stud})

                #remove student from ss and their schedule from sched_matrix
                ss.remove(stud)
                np.delete(sched_matrix, t, 0)
        else:
            #if there is not enough students to form a group
            for stud in ss:
                num.randint(0, len(groups))
                group_num = groups[num]
                con.execute('INSERT INTO group_membership VALUES(:group_id, :student_id)', {'group_id':group_id, 'student_id':stud})
                #somehow indicate group might not be optimal

    for g in groups:
        print("group id: ", g)

con.close()