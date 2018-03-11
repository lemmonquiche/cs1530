'''
    Before running these tests start the flask application 
    by: export FLASK_APP=grouper.py 
        flask run --host 0.0.0.0 -p 5000
'''
import unittest
import requests
import json
import sys


class TestFlaskApiUsingRequests(unittest.TestCase):
    
    def test_login(self):
        response = requests.post ('http://localhost:5000/login', data = {'username':'username', 'password':'password'})
        if not 'access_token' in  response.json():
            self.fail("there is not access token returned")
        self.assertEqual(response.status_code, 200)
        
    def test_login_negative(self):
        response = requests.post ('http://127.0.0.1:5000/login', data = {'username':'username', 'password':'ww'})
        if 'access_token' in  response.json():
            self.fail("there is not access token returned")
        
    def test_secret(self):
        response = requests.post ('http://localhost:5000/login', data = {'username':'username', 'password':'password'})
        token = response.json()['access_token']
        headers = {'Content-Type': 'application/json', 'Authorization': "Bearer {}".format(token)}
        response =requests.get('http://localhost:5000/secret', headers = headers)
        self.assertEqual(response.status_code, 200, "test_secret()> token did not work")
        
    def test_token_refresh(self):
        response = requests.post ('http://localhost:5000/login', data = {'username':'username', 'password':'password'})
        r_token = response.json()['refresh_token']
        headers = {'Content-Type': 'application/json', 'Authorization': "Bearer {}".format(r_token)}
        response =requests.post('http://localhost:5000/token/refresh', headers = headers)
        msg = "test_token_refresh()> r_token did not work {}".format(response.json())
        self.assertEqual(response.status_code, 200, msg)

    def test_logout_access(self):
        response = requests.post ('http://localhost:5000/login', data = {'username':'username', 'password':'password'})
        token = response.json()['access_token']
        headers = {'Content-Type': 'application/json', 'Authorization': "Bearer {}".format(token)}
        response =requests.post('http://localhost:5000/logout/access', headers = headers)
        self.assertEqual(response.status_code, 200, "test_logout_access()> token did not work")
        response =requests.post('http://localhost:5000/logout/access', headers = headers)
        msg = "test_logout_access()> token was not logout {}".format(response.json())
        self.assertNotEqual(response.status_code , 200, msg)
                            
    def test_logout_refresh(self):
        response = requests.post ('http://localhost:5000/login', data = {'username':'username', 'password':'password'})
        r_token = response.json()['refresh_token']
        headers = {'Content-Type': 'application/json', 'Authorization': "Bearer {}".format(r_token)}
        response = requests.post('http://localhost:5000/logout/refresh', headers = headers)
        msg = "test_logout_refresh()> token did not work {}".format(response.json())
        self.assertEqual(response.status_code, 200, msg)
        
        headers = {'Content-Type': 'application/json', 'Authorization': "Bearer {}".format(r_token)}
        response =requests.post('http://localhost:5000/token/refresh', headers = headers)
        msg  = "test_logout_refresh()> refresh token was not logout {}".format(response.json())
        self.assertNotEqual(response.status_code , 200, msg)

