class ParticipantClient {
    
    #id;
    #position;
    #direction;
    #businessCard;

    /**
     * Erstellt ParticipantClient Instanz
     * 
     * @author Klaudia
     * 
     * @param {PositionClient} position 
     * @param {DirectionClient} direction
     * @param {BusinessCardClient} businessCard
     */
    constructor(id, businessCard, position, direction) 
    {
        TypeChecker.isString(id);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, DirectionClient);
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient)

        this.#id = id;
        this.#position = position;
        this.#direction = direction;
        this.#businessCard = businessCard;
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
    
}
