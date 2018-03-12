import Pretender from 'pretender';

var server = new Pretender(function(){
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
});

export default server;
