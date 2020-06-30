import Position from './Position.js'
import Direction from './Direction.js'
import ParticipantController from '../../server/controller/ParticipantController.js'
import * as TypeChecker from '../../utils/TypeChecker.js'

export default class Participant {

    constructor(id, position, direction, participantController)
    {
        TypeChecker.isInt(id);
        TypeChecker.isInstanceOf(participantController, ParticipantController);

        this.id = id;
        this.participantController = participantController;

        if (!position || !direction)
        {
            this.position = new Position(1, 1, 1);
            this.direction = Direction.DOWNRIGHT;
        }

        else 
        {
            TypeChecker.isInstanceOf(position, Position);
            TypeChecker.isEnumOf(direction, Direction);

            this.position = position;
            this.direction = direction;
        }
    }

    getId() 
    {
        return this.id;
    }

    getPosition() 
    {
        return this.position;
    }

    setPosition(position) 
    {
        TypeChecker.isInstanceOf(position, Position);
        this.position = position;
    }

    getDirection() {
        return this.direction;
    }

    setDirection(direction) 
    {
        TypeChecker.isEnumOf(direction, Direction);
        this.direction = direction;
    }

    getParticipantController() 
    {
        return this.participantController;
    }
}


