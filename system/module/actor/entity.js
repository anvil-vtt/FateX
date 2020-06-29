export default class ActorFate extends Actor {

    /**
     * Provide basic configuration for newly created actors of type "character"
     *
     * @override
     * */
    static async create(data, options = {}) {
        data.token = data.token || {};
        if (data.type === "character") {
            mergeObject(data.token, {
                vision: true,
                dimSight: 30,
                brightSight: 0,
                actorLink: true,
                disposition: 1
            }, {overwrite: false});
        }
        return super.create(data, options);
    }
}
