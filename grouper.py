import os
from flask import Flask, send_from_directory, redirect, url_for

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

@app.route('/login', methods=['GET', 'POST'])
def login():
	"""Logs the user in."""
	pass

@app.route('/register', methods=['GET', 'POST'])
def register():
	"""Registers the user."""
	pass




