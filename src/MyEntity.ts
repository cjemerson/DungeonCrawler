/// <reference path="../library/gte/GTE.ts"/>

class MyEntity {
    transform = Matrix4.makeIdentity();
    position : Vector2 = new Vector2(0, 0);
    name: string = "unknown";
    sprites: number[] = [];
    alive = 0;

    // For movement
    alpha: number = -1;
    from: Vector2 = new Vector2();
    to: Vector2 = new Vector2();
    updir: number = 0;

    constructor() { }
}