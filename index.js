const credentials = require('./credentials')
const scraper = require('website-scraper')
const uuid = require('uuid')

exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body)

    const options = {
        s3Options: credentials.s3Options,
    }

    options.urls = [body.url]
    const date = new Date()
    const dateStr = date.toISOString().replace(/[^\d]/g, '')
    options.directory = `${dateStr}-${uuid()}`

    scraper.scrape(options)
        .then(() =>
            context.succeed({
                statusCode: 200,
                headers: { 'ContentFormat': 'application/json' },
                body: JSON.stringify({ success: 1 }),
            })
        ).catch((err) => {
            console.error('error saving', err)
            context.error({
                statusCode: 500,
                body: JSON.stringify(err),
            })
        })
};