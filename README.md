# grouper-flask-react 

## Intallation/Compilation/Execution Instruction 

1. Create a virtual environment for Python.
   - apt install pip
   - pip install virtualenv
   - virtualenv [env-dir]
   - source [env-dir]/bin/activate
2. From the root of the repository run `pip install -r requirements.txt`
3. Install/Build react app 
   - sudo apt install npm 
   - cd [react_app_dir] 
   - npm install
   - npm run build 
4. Add the `FLASK_APP` variable to your path. 
   - cd [app-root-dir]
   - export FLASK_APP=grouper.py
5. Running Flask App
   - python -m flask initdb
   - flask run --host 0.0.0.0 -p 5000 (Runs the service on `http://localhost:5000`)


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

## Sengrid API Setup

make `.env` file:

```bash
cp template.env .env
```

and edit the value of `sengrid_api_key` to be a valid Sendgrid API Key.


# Login/Logout API
* mostly fallowed this tutorial: https://codeburst.io/jwt-authorization-in-flask-c63c1acf4eeb
* export for postman grouper-login-logout-api.postman_collection.json
* unittest are writen in apitest.py run the grouper.py before running the test
* token based jwt lib used. Basic flow
	1. login and get refresh_token + access_token  
	2. use access_token untill it's expires, refresh access_token refresh_tolken 
	3. when at the logout 
		3.1. logout/access with access_token in the header
		3.2. logout/refresh with refresh_token in the header  
