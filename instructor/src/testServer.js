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

    var response = {
      group_list: [
        { id: 1, students: [
          {
            "email": "daler@gmail.com",
            "id": 2,
            "name": "Daler Rahimov"
          },
          {
            "email": "ballicock2@huffingtonpost.com",
            "id": 3,
            "name": "Betteann Allicock"
          },
          {
            "email": "lkeeri3@marriott.com",
            "id": 4,
            "name": "Lory Keeri"
          },
          {
            "email": "vsolan4@desdev.cn",
            "id": 5,
            "name": "Vanda Solan"
          },
          {
            "email": "mcraythorn5@tinyurl.com",
            "id": 6,
            "name": "Melessa Craythorn"
          }
        ] },
        { id: 2, students: [
          {
            "email": "test@gmail.com",
            "id": 1,
            "name": "Testing Testing"
          },
          {
            "email": "abahls6@sitemeter.com",
            "id": 7,
            "name": "Alessandra Bahls"
          },
          {
            "email": "gpay7@webs.com",
            "id": 8,
            "name": "Gizela Pay"
          },
          {
            "email": "wjirak8@amazon.co.jp",
            "id": 9,
            "name": "Willamina Jirak"
          },
          {
            "email": "adimitrescu9@sciencedaily.com",
            "id": 10,
            "name": "Alberta Dimitrescu"
          }
        ] }
      ],
      students: 
        [ { fname: 'Testing',    id: 1,  lname: 'Testing' },
          { fname: 'Daler',      id: 2,  lname: 'Rahimov' },
          { fname: 'Betteann',   id: 3,  lname: 'Allicock' },
          { fname: 'Lory',       id: 4,  lname: 'Keeri' },
          { fname: 'Vanda',      id: 5,  lname: 'Solan' },
          { fname: 'Melessa',    id: 6,  lname: 'Craythorn' },
          { fname: 'Alessandra', id: 7,  lname: 'Bahls' },
          { fname: 'Gizela',     id: 8,  lname: 'Pay' },
          { fname: 'Willamina',  id: 9,  lname: 'Jirak' },
          { fname: 'Alberta',    id: 10, lname: 'Dimitrescu' } ]
    };

    return new Promise(function (resolve) {
      setTimeout(function() {
        resolve([
          200, {"Content-Type": "application/json"}, JSON.stringify(response)
        ]);
      }.bind(this), 500);
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