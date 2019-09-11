const bcrypt = require('bcryptjs');

const helper = {};

helper.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
};

helper.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
};

module.exports = helper;