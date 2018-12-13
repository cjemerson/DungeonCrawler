// Charles Emerson
// Started: 16 Nov 2018
// Updated: 16 Nov 2018

///<reference path="../library/gte/Vector3.ts"/>

function getRandomBrightColor() {
    let r = Math.random()*0.25 + 0.25;
    let g = Math.random()*0.25 + 0.25;
    let b = Math.random()*0.25 + 0.25;

    let x = Math.random();
    if (Math.random() < 0.5) {
        if (x < 1/3) {
            r = 0.2*Math.random()+ 0.8;
        } else if (x < 2/3) {
            g = 0.2*Math.random() + 0.8;
        } else {
            b = 0.2*Math.random() + 0.8;
        }
    } else {
        if (x < 1/3) {
            r = 0.2*Math.random()+ 0.8;
            g = 0.2*Math.random() + 0.8;
        } else if (x < 2/3) {
            r = 0.2*Math.random() + 0.8;
            b = 0.2*Math.random() + 0.8;
        } else {
            g = 0.2*Math.random() + 0.8;
            b = 0.2*Math.random() + 0.8;
        }
    }

    return new Vector3(r, g, b);
}

function getRandomMutedColor() {
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    if (r < 0.3) {
        g = Math.random();
        if (g < 0.5) {
            b = Math.random() * 0.3 + 0.4;
        } else {
            b = Math.random() * 0.5;
        }
    } else if (r < 0.6) {
        if (b < 0.5) {
            g = Math.random() * 0.3 + 0.4;
        } else {
            g = Math.random() * 0.5;
        }
    } else {
        if (b < 0.5) {
            g = Math.random() * 0.3 + 0.4;
        } else {
            g = Math.random() * 0.5;
        }
    }
    return new Vector3(r, g, b);
}

function getRandomColor() {
    return new Vector3(Math.random(), Math.random(), Math.random());
}