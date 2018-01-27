# S3 File Manager
This is just a project to help me learn more about React while also having fun
with AWS.

Currently, all this will do is display a list of files belonging to the logged
in user and allow them to upload and delete. I still plan to implement downloading,
e-mailing and subfolders.

## Setup
You'll need to create two files to make this work.

First, you'll need to create
app.config.json in the config folder and format it thus:

```
{
    "aws": {
        "region": [The region in which your bucket resides],
        "credentials": {
            "accessKeyId": [Your IAM acccessKeyId],
            "secretAccessKey": [Your IAM secretAccessKey]
        },
        "bucket": [The name of your bucket]
    }
}
 ```
 
 The credentials should be for a user with full access to your bucket as well
 as permission to use STS.
 
 Second, you'll need a file in src/lib named client.config.js:
 ```
class config {
    auth0 = {
        domain: [DOMAIN.auth0.com],
        clientID: [CLIENT_ID],
        redirectUri: [CALLBACK URL],
        audience: [https://DOMAIN.auth0.com/userinfo],
    }
}
export default new config()
```
