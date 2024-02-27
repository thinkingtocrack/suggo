const admin_login = (req, res) => {
    if (req.session.err) {
        delete req.session.err
        res.render('admin/admin_login', { error: true })
    } else {
        res.render('admin/admin_login')
    }
}

module.exports={admin_login}