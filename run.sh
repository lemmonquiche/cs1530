(flask run --host 0.0.0.0 -p 5001 2>&1 > /dev/null &) 
(sqlite_web grouper.db -p 5002 -H 0.0.0.0 -P 2>&1 > /dev/null &)

