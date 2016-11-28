const secrets = require('./secrets')
const scraper = require('website-scraper')
const uuid = require('uuid')

const handler = (event, context, callback) => {
    const body = event.queryStringParameters

    const options = {
        s3Options: {
            bucket: secrets.s3Bucket,
            credentialsPath: './s3Credentials.json',
        }
    }

    options.urls = [body.url]
    const date = new Date()
    const dateStr = date.toISOString().replace(/[^\d]/g, '')
    options.directory = `${dateStr}-${uuid()}`

    scraper.scrape(options)
        .then(() =>
            context.succeed({
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ success: 1 }),
            })
        ).catch((err) => {
            console.error('error saving', err)
            context.fail({
                statusCode: 500,
                body: JSON.stringify(err),
            })
        })
};

exports.handler = handler
