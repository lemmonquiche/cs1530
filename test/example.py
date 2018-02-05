import os
import unittest
import tempfile

# import sys

# this_dir = os.path.dirname(os.path.realpath(__file__))
# parent_dir = os.path.join(this_dir, "..")
# sys.path.insert(0, parent_dir)

import grouper

class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
        # print(dir(grouper))
        # self.db_fd, grouper.app.config['DATABASE'] = tempfile.mkstemp()
        # grouper.app.testing = True
        self.app = grouper.app.test_client()
        # with grouper.app.app_context():
        #     grouper.init_db()

    def tearDown(self):
        pass
        # os.close(self.db_fd)
        # os.unlink(grouper.app.config['DATABASE'])

    def test_test_endpoint(self):
        rv = self.app.get('/404')
        assert rv.status_code == 404
