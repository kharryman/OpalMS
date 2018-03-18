#!/bin/bash
APP_ID="235cf670"

# check if 'ionic' remote exists and if not configure the project
HAS_IONIC_REMOTE=`git ls-remote --exit-code ionic`
if [ $? != 0 ]; then
  ionic config set -g backend pro
  ionic link --pro-id "$APP_ID"
  git remote add ionic git@git.ionicjs.com:ckitchens/cvat-mobile.git

  echo "Visit https://dashboard.ionicjs.com/login to add your public key before you continue"
  exit 1
fi

head -2 ionic.config.json         >  /tmp/ionic.config.json
echo "  \"app_id\": \"$APP_ID\"," >> /tmp/ionic.config.json
tail +4 ionic.config.json         >> /tmp/ionic.config.json
cp /tmp/ionic.config.json ./ionic.config.json

git checkout development
git pull --no-rebase

git push ionic development && \
  git tag "ionic-view-`date +%F`" && \
  git push origin --tags
