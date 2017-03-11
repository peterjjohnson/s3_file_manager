'use strict'

const AWS = require('aws-sdk'),
    appConfig = require('../config/app.config.json')

class FileManager {
    constructor(userId) {
        AWS.config.update({
            region: appConfig.aws.region,
            credentials: appConfig.aws.credentials
        })
        this.userId = userId
        this.root = 'user_files/' + this.userId + '/'
    }

    getCredentials() {
        const self = this
        return new Promise((resolve, reject) => {
            const sts = new AWS.STS()
            sts.getFederationToken(
                {
                    Name: self.userId,
                    Policy: JSON.stringify({
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Allow",
                                "Action": [
                                    "s3:*"
                                ],
                                "Resource": ["arn:aws:s3:::" + appConfig.aws.bucket ]
                            },
                            {
                                "Effect": "Allow",
                                "Action": [
                                    "s3:*"
                                ],
                                "Resource": ["arn:aws:s3:::" + appConfig.aws.bucket + "/*" ]
                            }
                        ]
                    })
                },
                (err, credentials) => {
                    if (err) reject(err)
                    const config = {
                        credentials: {
                            accessKeyId: credentials.Credentials.AccessKeyId,
                            secretAccessKey: credentials.Credentials.SecretAccessKey,
                            sessionToken: credentials.Credentials.SessionToken
                        },
                        region: appConfig.aws.region,
                        listParams: {
                            Bucket: appConfig.aws.bucket,
                            Prefix: this.root,
                            Delimiter: '/'
                        },
                        uploadParams: {
                            Bucket: appConfig.aws.bucket,
                            Key: this.root,
                            ServerSideEncryption: 'AES256'
                        },
                        deleteParams: {
                            Bucket: appConfig.aws.bucket,
                            Key: ''
                        }
                    }
                    resolve(config)
                }
            )
        })
    }
}

module.exports = FileManager;
