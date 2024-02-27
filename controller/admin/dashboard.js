const dashboard_home = (req, res) => {
    res.render('admin/admin_dashboard',{dark:0})
}

module.exports={dashboard_home}