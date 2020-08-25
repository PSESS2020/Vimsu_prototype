class WindowView extends Views {

    constructor() {
        super();

        if (new.target === WindowView) {
            throw new Error("Cannot construct abstract WindowView instances directly");
        }
    }

    draw() {
        throw new Error('draw() has to be implemented!');
    }
}