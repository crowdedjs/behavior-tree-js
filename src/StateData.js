/**
 * Represents time and state. Used to pass time values to behavior tree nodes.
 *
 * @property {number} deltaTime - The current time of this state representation
 * @property {object} state     - Any state data you would like to pass to the nodes.
 */
export default class StateData {
    deltaTime;
    state;
    constructor( deltaTime = 0, state = {}) {
        this.deltaTime = deltaTime;
        this.state = state;
    }
}
