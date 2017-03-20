# S3 File Manager
This is just a project to help me learn more about React well also having fun
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
 
 Second, you'll need a file in the root folder named stormpath.yml:
 ```
client:
  apiKey:
    id: [your apiKey id]
    secret: [your apiKey secret]
  application:
    href: [Your Stormpath application API URL]
```
