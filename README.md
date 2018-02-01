# grouper-flask-react 

*   Name: Daler Rahimov
*   Pitt ID: dar158

## Intallation/Compilation/Execution Instruction 

1. Create a virtual environment for Python.
   1.1.  apt install pip
   1.2.  pip install virtualenv
   1.3.  virtualenv [env-dir]
   1.4.  source [env-dir]/bin/activate
2. From the root of the repository run `pip install -r requirements.txt`
3. Install/Build react app 
   3.1. sudo apt install npm 
   3.2. cd [react_app_dir] 
   3.3. npm run build 
4. Add the `FLASK_APP` variable to your path. 
   4.1. cd [app-root-dir]
   4.2. export FLASK_APP=grouper.py
5. Running Flask App
   5.1. flask run --host 0.0.0.0 -p 5000 (Runs the service on `http://localhost:5000`)


## In case Installation Instraction does not work
1.  apt install pip
2.  pip install virtualenv
3.  virrualenv [dir]
4.  source [dir]/bin/activate
5.  pip install Flask
6.  pip install flask-sqlalchemy
7.  export FLASK_APP=cater.py
8.  python -m flask initdb (not yet)
9.  python -m flask run --host 0.0.0.0