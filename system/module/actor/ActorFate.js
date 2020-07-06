/**
 * ActorFate is the default entity class for actors inside the FATEx system.
 * Adds custom features based on the system.
 */
export class ActorFate extends Actor {

    /**
     * Provide basic configuration for newly created actor of type "character".
     * Automatically links new tokens to the actor.
     */
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
