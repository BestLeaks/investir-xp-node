const Friend = require('../../database/models/Friend')

module.exports = async (req, res) => {
    await Friend.find({}).populate({
        path: 'user',
        options: { sort: { 'dateAdded': -1 } }
    }).exec((error, friends) => {
        friendsData = []
        if (!error) {
            let obj
            let user
            friends.forEach((friend) => {
                user = friend.user[0]
                if (user) {
                    obj = {}
                    obj.epicName = user.epicName
                    obj.chartData = user.data[friend.mainDevice]
                    friendsData.push(obj)
                }
            });
        }
        return res.render('layouts/chart-list', {
            friendList: friendsData,
        })
    })
}
