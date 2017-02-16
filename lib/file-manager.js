'use strict';

const aws = require('aws-sdk'),
    appConfig = require('../config/app.config.json');

class FileManager {
    constructor(userId) {
        aws.config.update({
            region: appConfig.region,
            credentials: appConfig.credentials
        });
        this.userId = userId;
        this.root = 'user_files/' + this.userId + '/';
        this.credentials = this.getCredentials();
    }

    getCredentials() {
        return new Promise((resolve, reject) => {
            const sts = new aws.STS();
            sts.GetFederationToken(
                {
                    name: this.userId,
                    policy: {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Allow",
                                "Action": [
                                    "s3:GetObject",
                                    "s3:PutObject",
                                    "s3:DeleteObject"
                                ],
                                "Resource": ["arn:aws:s3:::" + appConfig.bucket + "/" + this.root + "/*"]
                            }
                        ]
                    }
                },
                (err, credentials) => {
                    if (err) return reject(err);
                    const config = sts.credentialsFrom(credentials);
                    config.params = {
                        Bucket: this.bucket,
                        Prefix: this.root,
                        Delimiter: '/'
                    }
                    return resolve(config);
                }
            );
        });
    }
}

module.exports = FileManager;
