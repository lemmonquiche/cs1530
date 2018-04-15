#!/usr/bin/env bash
password='pas'
python sqlite_web/ grouper.db -P $password -x -p 5002 -H 0.0.0.0

