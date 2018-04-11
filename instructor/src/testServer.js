import Pretender from 'pretender';

var students = [
  { id: 1, name: "Alice" , grouped: false },
  { id: 2, name: "Bob"   , grouped: false },
  { id: 3, name: "Carol" , grouped: false },
  { id: 4, name: "David" , grouped: false },
  { id: 5, name: "Erin"  , grouped: false },
  { id: 6, name: "Frank" , grouped: false },
  { id: 7, name: "Greg"  , grouped: false },
  { id: 8, name: "Hank"  , grouped: false },
];

var groups = [
  // { id: 1, name: "group1", students: [1, 2, 3, 4] },
  // { id: 2, name: "group2", students: [5, 6, 7, 8] }
];


var groups_ai = 0;
function addGroup() {
  groups.push({ id: ++groups_ai, name: 'group' + groups_ai})
}

var courses = [
  { course_id: 1, course_name: 'Introduction', passcode: 'abc' },
  { course_id: 2, course_name: 'Survey',       passcode: 'abc' },
  { course_id: 3, course_name: 'Advanced',     passcode: 'abc' }
];

if (process.env.NODE_ENV === 'development') {
var server = new Pretender(function(){
  this.get('/test', function () {
    return [200, {}, 'ok'];
  });

  this.post('/test', function (request) {
    return [200, {}, 'echo: ' + request.requestBody];
  });

  this.post('/api/instructor/course/count', function (request) {
    return [200, {"Content-Type": "application/json"}, JSON.stringify({count: 3})];
  });

  this.post('/api/instructor/course/groups/student', function (request) {
    var student_id = JSON.parse(request.requestBody)['student_id'];
    return [200, {'Content-Type': 'application/json'}, JSON.stringify({  })];
  });  
  this.post('/api/instructor/course/groups', function (request) {
    var class_id = JSON.parse(request.requestBody)['class_id'];

    var class_ = {
      class_id: class_id, name: 'ok', groups: [1, 2, 3, 4]
    };

    return new Promise(function (resolve) {
      setTimeout(function() {
        resolve([
          200, {"Content-Type": "application/json"}, JSON.stringify(class_)
        ]);
      }.bind(this), 100);
    });
  });


  this.get('/api/instructor/course', function (request) {
    console.log("API CALL: /api/instructor/course");

    var result = { courses };
    return new Promise(function (resolve) {
      setTimeout(function() {
        resolve([
          200, {"Content-Type": "application/json"}, JSON.stringify(result)
        ]);
      }.bind(this), 100);
    });
  });

  this.post('/api/instructor/addCourse', function (request) {
    var body = JSON.parse(request.requestBody);
    courses.push({ course_id: courses.length, course_name: body.name, passcode: 'random' });

    var result = first ? { error: 'DB' } : { status: 'success' };
    first = !first;

    return new Promise(function (resolve) {
      setTimeout(function() {
        resolve([
          200, {"Content-Type": "application/json"}, JSON.stringify(result)
        ]);
      }.bind(this), 100);
    });
  });
});
var first = true;
}

export default server;
