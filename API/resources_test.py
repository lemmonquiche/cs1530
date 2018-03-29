import unittest
import resources
import tempfile, os
from flask import Flask
import json
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

appf = Flask(__name__)
apif = Api(appf)
dbf = SQLAlchemy(appf)

apif.add_resource(resources.UserLogin, '/login')

import unittest
import flaskapi
import requests
import json
import sys

# class TestFlaskApiUsingRequests(unittest.TestCase):
#     def test_hello_world(self):
#         response = requests.get('http://localhost:5000')
#         self.assertEqual(response.json(), {'hello': 'world'})


class TestFlaskApi(unittest.TestCase):
    def setUp(self):
        self.app = appf.test_client()

    def test_hello_world(self):
        response = self.app.get('/')
        self.assertEqual(json.loads(response.get_data().decode(sys.getdefaultencoding())), {'hello': 'world'})


if __name__ == "__main__":
    unittest.main()

class TestUserLogin(unittest.TestCase):
    

    def setUp(self):
        self.db_fd, appf.config['DATABASE'] = tempfile.mkstemp()
        appf.config['TESTING'] = True
        self.app = appf.test_client()
         
    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(appf.config['DATABASE'])
    
#     
#     def test_empty_db(self):
#         data = {"username":"test", "passswor":"test"}
#         rv = self.app.post('/login', data = json.dumps(data))
#         print (rv.data)
    
if __name__ == "__main__":
    unittest.main()
    