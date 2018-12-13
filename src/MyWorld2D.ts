/// <reference path="../library/fluxions/Utils.ts" />
/// <reference path="../library/fluxions/TextParser.ts" />
/// <reference path="../library/gte/GTE.ts" />
/// <reference path="MyEntity.ts" />
/// <reference path="MyTileMap.ts" />

class MyWorld2D {
    entities: MyEntity[] = [];
    effects: MyEntity[] = [];
    tileMap = new MyTileMap();
    celSheet: MyImageArray;
    canvasWidth: number;
    canvasHeight: number;
    backgroundTileId: number = -1;
    backgroundScaleX: number = 1;
    backgroundScaleY: number = 1;
    tmap_surface : MyShape = new MyShape();
    loaded : boolean = false;
    entitiesLoaded = false;
    tilemapLoaded = false;
    dirty : boolean = false;

    constructor(private tileMapUrl: string,
            private entityUrl: string,
            celSheetUrl: string,
            celWidth: number,
            celHeight: number,
            renderingContext: FxRenderingContext) {

        let self = this;
        this.canvasWidth = renderingContext.width;
        this.canvasHeight = renderingContext.height;

        new Utils.TextFileLoader(tileMapUrl, (data: string, name: string, parameter: number) => {
            self.parseTileMap(data);
        });
        new Utils.TextFileLoader(entityUrl, (data: string, name: string, parameter: number) => {
            self.parseEntities(data);
        });

        this.celSheet = new MyImageArray(celSheetUrl, celWidth, celHeight);
    }

    parseTileMap(data: string) {
        this.dirty = true;
        this.tileMap.parseInputFile(data);
        this.tilemapLoaded = true;
    }

    parseEntities(data: string) {
        let tp = new TextParser(data);

        let entityIndex = this.entities.length - 1;
        for (let tokens of tp.lines) {
            if (tokens[0] == "entity" && tokens.length >= 2) {
                this.entities.push(new MyEntity());
                entityIndex = this.entities.length - 1;
                this.entities[entityIndex].name = tokens[1];
            }
            // set properties of most recent entity
            if (entityIndex < 0) continue;
            let v = new Vector3();
            switch (tokens[0]) {
                case "transform":
                    this.entities[entityIndex].transform = TextParser.ParseMatrix(tokens);
                    break;
                case "translate":
                    v = TextParser.ParseVector(tokens);
                    this.entities[entityIndex].transform.Translate(v.x, v.y, v.z);
                    break;
                case "position":
                    v = TextParser.ParseVector(tokens);
                    this.setEntityPosition(entityIndex, v.x, v.y);
                    break;
                case "rotate":
                    v = TextParser.ParseVector(tokens);
                    this.entities[entityIndex].transform.Rotate(v.x, 0, 0, 1);
                    break;
                case "alive":
                    if (tokens.length >= 2) {
                        this.entities[entityIndex].alive = parseInt(tokens[1]);
                    }
                    break;
                case "updir":
                    if (tokens.length >= 2) {
                        this.entities[entityIndex].updir = parseInt(tokens[1]);
                    }
                    break;
                case "sprites":
                    if (tokens.length >= 2) {
                        this.entities[entityIndex].sprites = [];
                        for (let i = 1; i < tokens.length; ++i) {
                            let id = parseInt(tokens[i]);
                            this.entities[entityIndex].sprites.push(id);
                        }
                    }
                    break;
            } // switch tokens
        } // for tokens
        
        this.entitiesLoaded = true;
    }

    getEntityIndexByName(name: string) {
        for (let index = 0; index < this.entities.length; ++index) {
            if (this.entities[index].name == name)
                return index;
        }
        return -1;
    }

    setEntityPosition(which: number, x: number, y: number): void {
        const tilemap_width = this.tileMap.wWidth;
        const tilemap_height = this.tileMap.wHeight;
        let x_distance = this.canvasWidth/tilemap_width;
        let y_distance = this.canvasHeight/tilemap_height;

        let x_diff = x - this.entities[which].position.x;
        let y_diff = y - this.entities[which].position.y;
        this.entities[0].transform.Translate(x_diff*x_distance, y_diff*y_distance, 0);
        this.entities[which].position.x = x;
        this.entities[which].position.y = y;
    }

    setBackground(backgroundTileId: number, backgroundScaleX: number, backgroundScaleY:number ) {
        this.backgroundTileId = backgroundTileId;
        this.backgroundScaleX = backgroundScaleX;
        this.backgroundScaleY = backgroundScaleY;
    }

    moveEntityPosition(which: number, x: number, y: number): void {
        const tilemap_width = this.tileMap.wWidth;
        const tilemap_height = this.tileMap.wHeight;
        let x_distance = this.canvasWidth/tilemap_width;
        let y_distance = this.canvasHeight/tilemap_height;

        this.entities[0].transform.Translate(x*x_distance, y*y_distance, 0);
        this.entities[which].position.x += x;
        this.entities[which].position.y += y;
    }

    load(tileMapUrl: string, entityUrl: string) {
        this.tileMapUrl = tileMapUrl;
        this.entityUrl = entityUrl;

        this.reload();
    }

    reload(): void {
        let self = this;
        this.entities.splice(0);
        new Utils.TextFileLoader(this.tileMapUrl, (data: string, name: string, parameter: number) => {
            self.parseTileMap(data);
        });
        new Utils.TextFileLoader(this.entityUrl, (data: string, name: string, parameter: number) => {
            self.parseEntities(data);
        });
        
    }

    renderCel(gl: WebGLRenderingContext, which: number, x: number, y: number, w: number, h: number) {
        this.celSheet.useTexture(gl, which, 0);
        let shape = new MyShape();

        shape.newSurface(gl.TRIANGLE_STRIP);

        let v0 = Vector2.make(x, y); // lower left
        let v1 = Vector2.make(x + w, y + h);   // upper right
        let st0 = Vector2.make(0.0, 0.0);  // lower left
        let st1 = Vector2.make(1.0, 1.0);  // upper right

        shape.texCoord(st0.x, st1.y);
        shape.vertex(v0.x, v1.y, 0);
        shape.texCoord(st0.x, st0.y);
        shape.vertex(v0.x, v0.y, 0);
        shape.texCoord(st1.x, st1.y);
        shape.vertex(v1.x, v1.y, 0);
        shape.texCoord(st1.x, st0.y);
        shape.vertex(v1.x, v0.y, 0);

        shape.draw(gl, 0, this.colorIndex, this.texCoordIndex);
    }

    private colorIndex = 0;
    private texCoordIndex = 0;

    // drawBackground(gl: WebGLRenderingContext, worldMatrixLocation: WebGLUniformLocation, colorIndex: number, texCoordIndex: number, scaleX = 1, scaleY = 1) {
    //     if (!this.celSheet.loaded) return;
    //     if (this.backgroundTileId < 0) return;

    //     const w = this.celSheet.subImageWidth * this.backgroundScaleX;
    //     const h = this.celSheet.subImageHeight * this.backgroundScaleY;

    //     this.texCoordIndex = texCoordIndex;
    //     this.colorIndex = colorIndex;

    //     gl.uniformMatrix4fv(worldMatrixLocation, false, this.tileMap.transform.toColMajorArray());
    //     for (let i = 0; i < this.canvasWidth; i += w) {
    //         for (let j = 0; j < this.canvasWidth; j += h) {
    //             let tileId = this.backgroundTileId;
    //             this.renderCel(gl, tileId, i * scaleX, j * scaleY, w * scaleX, h * scaleY);
    //         }
    //     }
    // }

    buildTMapSurface() {
        const sI_w = this.celSheet.subImageWidth;
        const sI_h = this.celSheet.subImageHeight;
        const sS_w = this.celSheet.image.width/sI_w;
        const sS_h = this.celSheet.image.height/sI_h;
        const visibleW = this.tileMap.vWidth;
        const visibleH = this.tileMap.vHeight;
        const worldW = this.tileMap.wWidth;
        const worldH = this.tileMap.wHeight;

        const w_lim = sI_w*worldW/2;
        const h_lim = sI_h*worldH/2;


        const TRIANGLE_FAN = WebGLRenderingContext.TRIANGLE_FAN;

        this.tmap_surface.clear();

        for (let i = 0; i < worldW; ++i) {
            for (let j = 0; j < worldH; ++j) {
                let id = this.tileMap.getTile(i, j);
                if (id < 0) continue;

                let x = i*sI_w;
                let y = j*sI_h;

                let x_left = 2*i/worldW - 1.0,
                    x_right = 2*(i+1)/worldW - 1.0;
                let y_top = 1.0 - 2*j/worldH,
                    y_bottom = 1.0 - 2*(j+1)/worldH;

                let s = id % sS_w,
                    t = Math.floor(id / sS_w);
                let s_left = s / sS_w,
                    s_right = (s+0.99) / sS_w;
                let t_top = (t)/sS_h,
                    t_bottom = (t+0.99)/sS_h;

        
                this.tmap_surface.newSurface(TRIANGLE_FAN);
                this.tmap_surface.texCoord(s_left, t_bottom);
                this.tmap_surface.vertex(x_left, y_bottom, 0.0);
                this.tmap_surface.texCoord(s_right, t_bottom);
                this.tmap_surface.vertex(x_right, y_bottom, 0.0);
                this.tmap_surface.texCoord(s_right, t_top);
                this.tmap_surface.vertex(x_right, y_top, 0.0);
                this.tmap_surface.texCoord(s_left, t_top);
                this.tmap_surface.vertex(x_left, y_top, 0.0);
                // hflog.log('TRIANGLE FAN ' + TRIANGLE_FAN);
                // hflog.log('xy - left : ' + x_left + ', right: ' + x_right + ", top: " + y_top + ", bottom: " + y_bottom);
                // hflog.log('st - left : ' + s_left + ', right: ' + s_right + ", top: " + t_top + ", bottom: " + t_bottom);
                // hflog.log("length " + this.tmap_surface.debug());
            }
        }
    }


    addTile(shape : MyShape, x : number, y : number, id : number) {
        const sI_w = this.celSheet.subImageWidth;
        const sI_h = this.celSheet.subImageHeight;
        const sS_w = this.celSheet.image.width/sI_w;
        const sS_h = this.celSheet.image.height/sI_h;
        const visibleW = this.tileMap.vWidth;
        const visibleH = this.tileMap.vHeight;
        const worldW = this.tileMap.wWidth;
        const worldH = this.tileMap.wHeight;

        const TRIANGLE_FAN = WebGLRenderingContext.TRIANGLE_FAN;

        let x_left = 2*x/worldW - 1.0,
            x_right = 2*(x+1)/worldW - 1.0;
        let y_top = 1.0 - 2*y/worldH,
            y_bottom = 1.0 - 2*(y+1)/worldH;

        let s = id % sS_w,
            t = Math.floor(id / sS_w);
        let s_left = s / sS_w,
            s_right = (s+0.99) / sS_w;
        let t_top = (t)/sS_h,
            t_bottom = (t+0.99)/sS_h;

        shape.newSurface(TRIANGLE_FAN);
        shape.texCoord(s_left, t_bottom);
        shape.vertex(x_left, y_bottom, 0.0);
        shape.texCoord(s_right, t_bottom);
        shape.vertex(x_right, y_bottom, 0.0);
        shape.texCoord(s_right, t_top);
        shape.vertex(x_right, y_top, 0.0);
        shape.texCoord(s_left, t_top);
        shape.vertex(x_left, y_top, 0.0);
    }

    isWalkable(pos : Vector2, updir : number) {
        switch (updir) {
            case 0:
                if (pos.y == 0)
                    return false;
                pos.y = pos.y - 1;
                break;
            case 1:
                if (pos.x == this.tileMap.wWidth - 1)
                    return false;
                pos.x = pos.x + 1;
                break;
            case 2:
                if (pos.y == this.tileMap.wHeight - 1)
                    return false;
                pos.y = pos.y + 1;
                break;
            case 3:
                if (pos.x == 0)
                    return false;
                pos.x = pos.x - 1;
                break;
            default:
                hflog.error('Invalid updir argument for isWalkable().');
                return;
        }
        if ( (this.tileMap.getTile(pos.x, pos.y) >= 0 && this.tileMap.getTile(pos.x, pos.y) < 16)
            || this.tileMap.getTile(pos.x, pos.y) == 32) {
            return false;
        }
        return true;
    }

    isExit(pos : Vector2) {
        return (this.tileMap.getTile(pos.x, pos.y) == 28);
    }

    addEffect(sprites : number[], position : Vector2, updir : number, alive : number) {
        let e = new MyEntity();
        e.alive = alive;
        e.position = position;
        e.updir = updir;
        e.sprites = sprites;
        this.effects.push(e);
    }

    checkDraw() : boolean {
        this.loaded = this.celSheet.loaded && this.tilemapLoaded && this.entitiesLoaded;
        return this.celSheet.loaded && this.tilemapLoaded && this.entitiesLoaded;
        // if (!this.celSheet.loaded) {
        //     return false;
        // } else if (!this.loaded) {
        //     this.buildTMapSurface();
        //     this.loaded = true;
        // } else if (!this.tilemapLoaded || !this.entitiesLoaded) {
        //     this.loaded = false;
        //     return;
        // }
    }

    draw(gl: WebGLRenderingContext, vertexIndex: number, colorIndex: number, texCoordIndex: number) {
        // if (!this.celSheet.loaded) {
        //     return;
        // } else if (!this.loaded) {
        //     this.buildTMapSurface();
        //     this.loaded = true;
        // } else if (!this.tilemapLoaded || !this.entitiesLoaded) {
        //     this.loaded = false;
        //     return;
        // }
        if (!this.checkDraw()) {
            return;
        } else if (this.dirty) {
            this.buildTMapSurface();
            this.dirty = false;
            hflog.log('Built');
        }

        const vW = this.tileMap.vWidth;
        const vH = this.tileMap.vHeight;
        
        let texture = this.celSheet.image.createTexture(gl);
        if (!texture) {
            hflog.error('Unable to create World2D texture from spritesheet.');
            return;
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.tmap_surface.draw(gl, vertexIndex, colorIndex, texCoordIndex);


        // let e = this.entities[this.getEntityIndexByName("player")];
        // texture = this.celSheet.subImages[e.sprites[e.updir]];
        let surface = new MyShape();

        // this.addTile(surface, e.position.x, e.position.y, e.sprites[e.updir]);
        for (let i = 0; i < this.entities.length; ++i) {
            let e = this.entities[i];

            if (e.alive < 0 || e.updir < 0 || e.sprites.length < 1) continue;

            this.addTile(surface, e.position.x, e.position.y, e.sprites[e.updir]);
        }

        for (let i = 0; i < this.effects.length; ++i) {
            let e = this.effects[i];

            if (e.alive < 0 || e.updir < 0 || e.sprites.length < 1) continue;
            
            this.addTile(surface, e.position.x, e.position.y, e.sprites[e.updir]);
            --this.effects[i].alive;
            if (this.effects[i].alive < 0) this.effects.slice(i, 1);
        }

        surface.draw(gl, vertexIndex, colorIndex, texCoordIndex);

        // const sI_w = this.celSheet.subImageWidth;
        // const sI_h = this.celSheet.subImageHeight;
        // const visibleW = this.tileMap.vWidth;
        // const visibleH = this.tileMap.vHeight;
        // const worldW = this.tileMap.wWidth;
        // const worldH = this.tileMap.wHeight;

        // const WW = sI_w*worldW/2;
        // const HH = sI_h*worldH/2;
        // const ww = this.celSheet.image.width/sI_w;
        // const hh = this.celSheet.image.height/sI_h;

        // let player = this.entities[this.getEntityIndexByName("player")];


        // let y_start : number, y_end : number;

        // {
        //     const halfVisibleH = Math.floor(visibleH/2);
        //     const player_y = player.position.y;

        //     y_start = Math.max(0, player_y - halfVisibleH);
        //     y_end = Math.min(worldH, player_y + halfVisibleH);

        //     if (player_y < halfVisibleH) {
        //         y_end = visibleH;
        //     } else if (player_y > worldH - halfVisibleH) {
        //         y_start = worldH - visibleH;
        //     }
        // }

        // this.texCoordIndex = texCoordIndex;
        // this.colorIndex = colorIndex;

        // let surface = new MyShape();

        // hflog.log('y_start ' + y_start + ', y_end ' + y_end);

        // // draw tile sheet
        // for (let i = 0; i < visibleW; i++) {
        //     for (let j = 0; j < visibleH; j++) {
        //         let id = this.tileMap.getTile(i, j + y_start);
        //         if (id < 0) continue;

        //         let x = i*sI_w;
        //         let y = j*sI_h;

        //         // let x_left = x/WW-1.0,
        //         //     x_right = (x+w)/WW - 1.0;
        //         // let y_top = (y_start - j)/y_diff,
        //         //     y_bottom = (y_end - (y_start+1))/y_diff;

        //         let x_left = x/WW-1.0,
        //             x_right = (x+sI_w)/WW - 1.0;
        //         let y_top = 1.0 - y/HH,
        //             y_bottom = 1.0 - (y+sI_h)/HH;

        //         let s = id % worldW,
        //             t = Math.floor(id/worldW);
        //         let s_left = s / worldW,
        //             s_right = (s+0.99) / worldW;
        //         let t_top = (t)/hh,
        //             t_bottom = (t+0.99)/hh;

        //         surface.newSurface(gl.TRIANGLE_FAN);
        //         surface.texCoord(s_left, t_bottom);
        //         surface.vertex(x_left, y_bottom, 0.0);
        //         surface.texCoord(s_right, t_bottom);
        //         surface.vertex(x_right, y_bottom, 0.0);
        //         surface.texCoord(s_right, t_top);
        //         surface.vertex(x_right, y_top, 0.0);
        //         surface.texCoord(s_left, t_top);
        //         surface.vertex(x_left, y_top, 0.0);
        //     }
        // }

        // for (let i = 0; i < this.entities.length; ++i) {
        //     let e = this.entities[i];
        //     if (e.alive >= 0) {
        //         let id = e.sprites[e.updir];

        //         if (id < 0) continue;

        //         let x = e.position.x*w;
        //         let y = e.position.y*h;

        //         // hflog.log('x: ' + e.position.x + ', y: ' + e.position.y);

        //         let x_left = x/WW-1.0,
        //             x_right = (x+w)/WW - 1.0;
        //         let y_top = 1.0 - y/HH,
        //             y_bottom = 1.0 - (y+h)/HH;

        //         let s = id % ww,
        //             t = Math.floor(id/ww);
        //         let s_left = s / ww,
        //             s_right = (s+0.99) / ww;
        //         let t_top = (t)/hh,
        //             t_bottom = (t+0.99)/hh;

        //         surface.newSurface(6); // gl.TRIANGLE_FAN == 6
        //         surface.texCoord(s_left, t_bottom);
        //         surface.vertex(x_left, y_bottom, 0.0);
        //         surface.texCoord(s_right, t_bottom);
        //         surface.vertex(x_right, y_bottom, 0.0);
        //         surface.texCoord(s_right, t_top);
        //         surface.vertex(x_right, y_top, 0.0);
        //         surface.texCoord(s_left, t_top);
        //         surface.vertex(x_left, y_top, 0.0);
        //     }
        // }

        // let texture = this.celSheet.image.createTexture(gl);
        // if (!texture) {
        //     hflog.error('Unable to bind texture.');
        //     return;
        // }

        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // surface.draw(gl, vertexIndex, colorIndex, texCoordIndex);
        // // draw sprites
        // for (let entity of this.entities) {
        //     if (entity.alive < 0) continue;
        //     let x = entity.position.x;
        //     let y = entity.position.y;
        //     this.renderCel(gl, entity.sprites[0], x * w, y * w, w, h);
        //     // let m = Matrix4.multiply(Matrix4.makeScale(scaleX, scaleY, 0.0), entity.transform);
        //     // gl.uniformMatrix4fv(worldMatrixLocation, false, m.toColMajorArray());
        //     // this.renderCel(gl, entity.sprites[0], 0, 0, w, h);
        // }
    }
}