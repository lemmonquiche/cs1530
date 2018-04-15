# grouper-flask-react 

## Intallation/Compilation/Execution Instruction 
### Installation
1. Install python 2.7 by running:
   - `sudo apt install python2.7 python-pip`
1. Install yarn by running: 
   - `sudo apt install yarn -g` 
1. Install pip by running:
   - `sudo apt install pip` 
1. Install virtualenv by running 
   - `pip install virtualenv`

### Compelation/Execution 

1. Create a virtual environment for Python and activate:
   - `virtualenv [env-dir]` (env-dir - is a directory that will be created and where all virtual env will be localed)
   - `source [env-dir]/bin/activate` 
1. Copy the repo: 
   - `git clone https://github.com/lemmonquiche/cs1530`
1. To install all requirements to virtual env from the root of the repository run: 
   - `pip install -r requirements.txt`
1. Install/Build react app by running script from root of the repository
   - `./build.sh`
1. Add the `FLASK_APP` variable to your path. 
   - `cd [app-root-dir]`
   - `export FLASK_APP=grouper.py`
1. Running Flask App
   - `python -m flask initdb`
   - `flask run --host 0.0.0.0 -p 5000` (Runs the service on `http://localhost:5000`)

## Database Load Mode
1. Initialize new database with all the data: 
   - `python -m flask initdb` 
1. Dump the database into a dump.sql file 
   - `python -m flask dumpdb` 
1. Load the database from dump.sql file 
   - `python -m flask loaddb`

## Database administration
1. Launch application in Database Administration mode by running the script `administrate_database.sh`
1. Obtain password by reading the script
1. Log in to the administrative site by entering the password from the `adminstrate_database.sh` script.

## In case Installation Instraction does not work
1.  `apt install pip`
1.  `pip install virtualenv`
1.  `virrualenv [dir]`
1.  `source [dir]/bin/activate`
1.  `pip install Flask`
1.  `pip install flask-sqlalchemy`
1.  `export FLASK_APP=cater.py`
1.  `python -m flask initdb (not yet)`
1.  `python -m flask run --host 0.0.0.0`

