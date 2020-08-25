class Views {

    constructor() {

        if (new.target === Views) {
            throw new Error("Cannot construct abstract Views instances directly");
        }
    }

    draw() {
        throw new Error('draw() has to be implemented!');
    }
}