import PositionClient from './PositionClient.js'
import DirectionClient from './DirectionClient.js'
import * as TypeChecker from '../../utils/TypeChecker.js'

export default class ParticipantClient {
    
    constructor(position, direction) 
    {
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, DirectionClient);

        this.position = position;
        this.direction = direction;
    }

    getPosition() 
    {
        return this.position;
    }

    setPosition(position) 
    {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.position = position;
    }

    getDirection() 
    {
        return this.direction;
    }

    setDirection(direction) 
    {
        TypeChecker.isEnumOf(direction, DirectionClient);
        this.direction = direction;
    }
}