module.exports = {
    createUserEntry: function (data) {
        let newUser = {
            name: data.name,
            username: data.username,
            userType: data.userType ? data.userType : "AGENT",
            phone: data.phone,
            organization: data.organization
        }
        return newUser;
    }
}