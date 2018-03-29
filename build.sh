for i in signin student instructor; do
  echo "Doing folder ${i} now:"
  cd "$i"
  git pull
  yarn install
  yarn build
  cd ..
done
