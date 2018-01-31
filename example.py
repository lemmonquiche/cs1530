import os
import unittest
import tempfile

# import sys

# this_dir = os.path.dirname(os.path.realpath(__file__))
# parent_dir = os.path.join(this_dir, "..")
# sys.path.insert(0, parent_dir)

import app as flaskr

class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
        # print(dir(flaskr))
        # self.db_fd, flaskr.app.config['DATABASE'] = tempfile.mkstemp()
        # flaskr.app.testing = True
        self.app = flaskr.app.test_client()
        # with flaskr.app.app_context():
        #     flaskr.init_db()

    def tearDown(self):
        pass
        # os.close(self.db_fd)
        # os.unlink(flaskr.app.config['DATABASE'])

    def test_test_endpoint(self):
        rv = self.app.get('/test')
        print(rv.data)
        assert b'Hello World!' == rv.data
