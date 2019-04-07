const User = require('../../database/models/User')

// TODO: Refactor: everything is hardcoded
module.exports = async (req, res) => {
    let guiId = ['ee148e8d55c64a3cb2013fc78ef8ed00', 'keyboardmouse']
    let marquesId = ['9ab0596827454c7bb9a94fb3f315095a', 'gamepad']
    let theusId = ['95e6515691004c3f826516ac26877707', 'keyboardmouse']
    let jhowId = ['2079b036b2a7418f8f4bc5c2beee60ea', 'keyboardmouse']

    let handleError = err => {
        console.log('Error while trying to find a friend', err)
    }

    let handleSuccess = users => {
        return users
    }

    let gui = await User.findOne({
        accountId: guiId[0]
    }).sort('-dateAdded')
    let marques = await User.findOne({
        accountId: marquesId[0]
    }).sort('-dateAdded')
    let theus = await User.findOne({
        accountId: theusId[0]
    }).sort('-dateAdded')
    let jhow = await User.findOne({
        accountId: jhowId[0]
    }).sort('-dateAdded')

    await Promise.all([gui, marques, theus, jhow]).then(
        users => handleSuccess(users)
    ).catch(handleError)

    gui.chartData = gui['data'][guiId[1]]
    marques.chartData = marques['data'][marquesId[1]]
    theus.chartData = theus['data'][theusId[1]]
    jhow.chartData = jhow['data'][jhowId[1]]

    let friendList = [
        gui, marques, theus, jhow
    ]

    res.render('layouts/chart-list', {
        friendList
    })
}