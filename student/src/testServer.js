import Pretender from 'pretender';

if (process.env.NODE_ENV === 'development') {

var classViewData = {
  "students_in_groups": [
    {"group": 1, "id": 3, "name": "Betteann Allicock"},
    {"group": 1, "id": 4, "name": "Lory Keeri"},
    {"group": 1, "id": 5, "name": "Vanda Solan"},
    {"group": 1, "id": 6, "name": "Melessa Craythorn"},
    {"group": 1, "id": 7, "name": "Alessandra Bahls"},
    {"group": 2, "id": 1, "name": "Testing1 Testing"},
    {"group": 2, "id": 2, "name": "Daler Rahimov"},
    {"group": 2, "id": 8, "name": "Gizela Pay"},
    {"group": 2, "id": 9, "name": "Willamina Jirak"},
    {"group": 2, "id": 10, "name": "Alberta Dimitrescu"}
  ],
  "students_in_course": [
    {"id": 1, "name": "Testing1 Testing"},
    {"id": 2, "name": "Daler Rahimov"},
    {"id": 3, "name": "Betteann Allicock"},
    {"id": 4, "name": "Lory Keeri"},
    {"id": 5, "name": "Vanda Solan"},
    {"id": 6, "name": "Melessa Craythorn"},
    {"id": 7, "name": "Alessandra Bahls"},
    {"id": 8, "name": "Gizela Pay"},
    {"id": 9, "name": "Willamina Jirak"},
    {"id": 10, "name": "Alberta Dimitrescu"},
  ]
};

var server = new Pretender(function(){
  this.get('/test', function () {
    return [200, {}, 'ok'];
  });

  this.post('/test', function (request) {
    return [200, {}, 'echo: ' + request.requestBody];
  });

  this.post('/api/student/classes/search', function (request) {
    var res = [
      {
        course_id: 1,
        course_name: 'a',
        instructors: [{ name: 'A' }]
      },
      {
        course_id: 2,
        course_name: 'b',
        instructors: [{ name: 'B' }]
      },
      {
        course_id: 3,
        course_name: 'c',
        instructors: [{ name: 'C' }]
      },
    ];
    return [200, {"Content-Type": "application/json"}, JSON.stringify(res)];
  })

  this.get('/whoami', function () {
    return [200, {'Content-Type': 'application/json'}, JSON.stringify({me: 1})];
  });

  this.post('/api/student/joined/view', function (request) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([200, {"Content-Type": "application/json"}, JSON.stringify(classViewData)]);
      }, 200);
    });    
  });

  this.get('/api/profile', function (request) {
    var response = { name: 'Test', username: 'test', email: 'test@example.com' };
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([200, {"Content-Type": "application/json"}, JSON.stringify(response)]);
      }, 200);
    });    
  });

  this.post('/api/profile', function (request) {
    console.log('API CALL: /api/profile, received profile.');
    console.log(JSON.parse(request.requestBody));
    var response = { status: 'success' };
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([200, {"Content-Type": "application/json"}, JSON.stringify(response)]);
      }, 200);
    });
  });

  this.post('/api/login/user', function(request) {
    console.log("API CALL: /api/login/user");
    var response = { err: 'Unspecified error' };

    var body = JSON.parse(request.requestBody);
    if (body['username'] === 'test') {
      response = {
        username: body['username'],
        name: 'Test User',
        info: 'custom info here',
      };
    } else {
      response = { err: 'User not recognized' };
    }

    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([200, {"Content-Type": "application/json"}, JSON.stringify(response)]);
      }, 400);
    });
  });

  this.post('/api/login/credentials', function (request) {
    console.log("API CALL: /api/login/credentials");
    var response = { err: 'Unspecified error'};

    var body = JSON.parse(request.requestBody);
    if (body['username'] === 'test' && body['password'] === 'pwd') {
      response = {
        success: true
      };
    } else {
      response.err = 'Incorrect Password';
    }

    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([200, {"Content-Type": "application/json"}, JSON.stringify(response)]);
      }, 400);
    });
  });

  this.post('/api/login/signup', function (request) {
    console.log("API CALL: /api/login/signup");
    var body = JSON.parse(request.requestBody);
    var email = body.email;
    console.log("New User", body.username);

    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve([200, null, JSON.stringify({ msg: 'Emailed ' + email })]);
      }, 400);
    });
  });

  // this.get('/photos/:id', function(request){
  //   return [200, {"Content-Type": "application/json"}, JSON.stringify(PHOTOS[request.params.id])]
  // });

  this.get('/api/student/schedule', function (request) {
    var cells = JSON.stringify({schedule: "0111000011100001110000111000011100001110000111000011100001110000111000011100001110000111000011100001110000111000011100001110000111000011100001110000111000011100001110000111000011100001110000111000"});

    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve([200, {"Content-Type": "application/json"}, JSON.stringify({ schedule: cells })]);
      }, 400);
    });
  })
});
}

export default server;
