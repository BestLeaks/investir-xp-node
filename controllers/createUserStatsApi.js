const User = require('../database/models/User')
const https = require('../services/https')

module.exports = (req, res) => {

    let userId = req.params.userId

    let endpoint = `https://fortnite-public-api.theapinetwork.com/prod09/users/public/br_stats_v2?user_id=${userId}`

    res.setHeader('Content-Type', 'application/json')

    let handleSuccess = data => {
        User.create(data, (error, user) => {
            res.end(JSON.stringify({
                user
            }))
        })
    }

    let handleError = error => {
        res.end(JSON.stringify({
            error: error,
        }))
    }

    https(endpoint).then(handleSuccess, handleError)
}