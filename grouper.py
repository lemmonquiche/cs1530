import os
from flask import Flask, send_from_directory

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
