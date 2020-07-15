class ParticipantClient {
    
    #id;
    #position;
    #direction;
    #businessCard;
    #username;

    /**
     * Erstellt ParticipantClient Instanz
     * 
     * @author Klaudia
     * 
     * @param {PositionClient} position 
     * @param {DirectionClient} direction
     * @param {BusinessCardClient} businessCard
     * @param {String} username
     */
    constructor(id, position, direction, username) 
    {
        TypeChecker.isString(id);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, DirectionClient);
        //TypeChecker.isInstanceOf(businessCard, BusinessCardClient)

        this.#id = id;
        this.#position = position;
        this.#direction = direction;
        this.#username = username;
        //this.#businessCard = businessCard;
    }

    getId()
    {
        return this.#id;
    }

    getPosition() 
    {
        return this.#position;
    }

    setPosition(position) 
    {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
    }

    getDirection() 
    {
        return this.#direction;
    }

    setDirection(direction) 
    {
        TypeChecker.isEnumOf(direction, DirectionClient);
        this.#direction = direction;
    }

    getBusinessCard()
    {
        return this.#businessCard;
    }

    getName()
    {
        return this.#username;
    }
}
