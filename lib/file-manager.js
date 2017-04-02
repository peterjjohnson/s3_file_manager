'use strict'

// Include AWS and our appConfig data
const AWS = require('aws-sdk'),
    appConfig = require('../config/app.config.json')

/**
 * Class to handle all server-side communication with S3
 */
class FileManager {

    /**
     * On instantiation we want to authenticate to AWS and specify our user and root folder
     *
     * @param string userId - User identifier
     */
    constructor(userId) {
        AWS.config.update({
            region: appConfig.aws.region,
            credentials: appConfig.aws.credentials
        })
        this.userId = userId
        this.root = 'user_files/' + this.userId + '/'
    }

    /**
     * Generate a policy for the logged in user and use it to retrieve custom temporary
     * credentials from AWS STS
     *
     * @returns {Promise}
     */
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
                                "Sid": "AllowListingContentsOfUserFolder",
                                "Effect": "Allow",
                                "Action": ["s3:ListBucket"],
                                "Resource": [`arn:aws:s3:::${appConfig.aws.bucket}`],
                                "Condition": {
                                    "StringLike": {
                                        "s3:prefix": [`${self.root}*`],
                                        "s3:delimiter": ['/']
                                    }
                                }
                            },
                            {
                                "Sid": "AllowActionsWithinUserFolder",
                                "Effect": "Allow",
                                "Action": ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"],
                                "Resource": [`arn:aws:s3:::${appConfig.aws.bucket}/*`]
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
