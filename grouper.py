import os
from flask import Flask, send_from_directory, redirect, url_for, request

from util.email import send_email as email

app = Flask(__name__, static_folder='react_app/build')

############################################
# Routes 
############################################
@app.route('/')
def main_page():
	""" This is the seleton page 
	"""
	return redirect(url_for('grouper'))

@app.route('/grouper')
def grouper():
  return send_from_directory('react_app/build', 'index.html')

@app.route('/email', methods=['GET'])
def email_get():
  # request.args.success ? "congrats" : ""
  # return """
  return ("<p>Congrats, sent!</p>" if request.args.get('success') else "") + """
    <form action="/email" method="post">
      <input type="text" name="to"></input>
      <input type="text" name="from"></input>
      <input type="text" name="message"></input>
      <input type="submit"></input>
    </form>
  """
@app.route('/email', methods=['POST'])
def email_post():
  print(request.form.get('to'))
  print(request.form.get('from'))
  print(request.form.get('message'))
  email(request.form.get('from'), request.form.get('to'), request.form.get('message'))
  return redirect(url_for(email_get.__name__, success=['true']))
