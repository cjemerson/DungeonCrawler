/// <reference path="../library/gte/GTE.ts" />
/// <reference path="../library/fluxions/Utils.ts" />
/// <reference path="MyImageArray.ts" />

class MyTileMap {
    vWidth = 0;
    vHeight = 0;
    wWidth = 0;
    wHeight = 0;
    tileData: number[] = [];

    constructor() { }

    parseInputFile(data: string) {
        // do something with this string
        let tp = new TextParser(data);

        let count = 0;
        for (let tokens of tp.lines) {
            if (count == 0 && tokens.length > 1) {
                let cols = parseInt(tokens[0]);
                let rows = parseInt(tokens[1]);

                this.vWidth = cols;
                this.vHeight = rows;

                if (tokens.length > 3) {
                    cols = parseInt(tokens[2]);
                    rows = parseInt(tokens[3]);
                }

                this.resize(cols, rows);

            } else {
                for (let i = 0; i < tokens.length; i++) {
                    let tileId = parseInt(tokens[i]);
                    this.setTile(i, count - 1, tileId);
                }
            }
            ++count;
        }
    }

    resize(numCols: number, numRows: number) {
        this.wWidth = numCols;
        this.wHeight = numRows;
        this.tileData = [];
        this.tileData.length = numCols * numRows;
        for (let i = 0; i < this.tileData.length; i++) {
            this.tileData[i] = -1;
        }
    }

    setTile(col: number, row: number, tileId: number) {
        if (col < 0 || row < 0 || col >= this.wWidth || row >= this.wHeight) return;
        const addr = row * this.wWidth + col;
        this.tileData[addr] = tileId;
    }

    getTile(col: number, row: number): number {
        if (col < 0 || row < 0 || col >= this.wWidth || row >= this.wHeight) return -1;
        const addr = row * this.wWidth + col;
        return this.tileData[addr];
    }
}