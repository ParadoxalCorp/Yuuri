//Not sure why i would made that a class but ok

class References {
    constructor() {}

    /**
     * Returns the default guild entry structure used in the database
     * @param {string} id The ID of the guild
     * @returns {object} A guild entry 
     */
    static guildEntry(id) {
        return {
            id: id,
            prefix: ""
        };
    }

    /**
     * Returns the default user entry structure used in the database
     * @param {string} id The ID of the user
     * @returns {object} A user entry 
     */
    static userEntry(id) {
        return {
            id: id,
        };
    }
}

module.exports = References;