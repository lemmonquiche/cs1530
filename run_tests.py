import unittest

def run_test_suite():
  tests = unittest.TestLoader().discover('test', pattern = '*.py')
  unittest.runner.TextTestRunner().run(tests)

if __name__ == '__main__':
  run_test_suite()
