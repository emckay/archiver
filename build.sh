DATE=`date +%Y%m%d`
zip -r9 builds/$DATE.zip index.js node_modules package.json secrets.js s3Credentials.json
