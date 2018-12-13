// Charles Emerson
// Started: 14 Nov 2018
// Updated: 14 Nov 2018
// 
// For CS480 Research Project

class DungeonCrawlerApp {
    renderingContext: FxRenderingContext;
    t0 = 0;
    t1 = 0;
    dt = 0;
    uiUpdateTime = 0;
    keysUpdateTime = 0;

    controls: MyControls;
    mouseClickPosition: Vector2 = new Vector2(-100, -100);

    world : MyWorld2D;

    shaderProgram: WebGLProgram | null = null;

    aVertexLocation: number = 0;
    aColorLocation: number = 0;
    aTextureCoordLocation: number = 0;
    uModelViewMatrixLocation: WebGLUniformLocation | null = null;
    uProjectionMatrixLocation: WebGLUniformLocation | null = null;
    uColor: WebGLUniformLocation | null = null;
    uWorldMatrixLocation: WebGLUniformLocation | null = null;
    uTextureMapLocation: WebGLUniformLocation | null = null;
    uMapTexture : WebGLUniformLocation | null = null;

    constructor(public width: number = 512, public height: number = 384) {
        hflog.logElement = "log";
        width = Math.floor(document.body.clientWidth);
        height = Math.floor(width * 3.0 / 4.0);
        this.renderingContext = new FxRenderingContext(width, height, "app");
        this.width = this.renderingContext.width;
        this.height = this.renderingContext.height;
        if (!this.renderingContext) {
            hflog.log('Unable to create new FxRenderingContext');
        }

        this.controls = new MyControls();

        this.world = new MyWorld2D("./assets/crawler-tilemap-level0.txt",
        "./assets/crawler-entities-level0.txt", "./assets/crawler_spritesheet.png", 32, 32, this.renderingContext);
    }

    run(): void {
        this.init();
        this.mainloop(0);
    }

    private init(): void {
        this.loadInput();
        this.loadShaders();
    }



    private loadInput(): void {
        this.renderingContext.canvas.onclick = (e) => {
            // Global offset
            // hflog.log("Global: (" + (e.x) + ", " + e.y + ")");
            
            // // Canvas offset
            // hflog.log("Canvas: (" + (e.offsetX) + ", " + e.offsetY + ")");
            this.mouseClickPosition.x = e.offsetX
            this.mouseClickPosition.y = e.offsetY;
            
            
            // let x = e.offsetX / this.renderingContext.canvas.width  *  2 - 1;
            // let y = e.offsetY / this.renderingContext.canvas.height * -2 + 1;
            
            // hflog.log("webgl: (" + x + ", " + y + ")");

        }
    }

    private loadShaders(): void {
        let gl = this.renderingContext.gl;

        const vsSource = `#version 100
        #extension GL_OES_standard_derivatives: enable

        attribute vec4 aVertexPosition;
        attribute vec4 aColor;
        attribute vec3 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uWorldMatrix;

        varying vec4 vColor;
        varying vec3 vTextureCoord;

        void main() {
            vec4 worldPosition = uWorldMatrix * aVertexPosition;
            vColor = aColor;
            vTextureCoord = aTextureCoord;

            gl_Position = uProjectionMatrix * uModelViewMatrix * worldPosition;
        }
        `;
        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);

        const fsSource = `#version 100
        #extension GL_OES_standard_derivatives: enable

        precision mediump float;
        uniform float map_texture;
        uniform sampler2D uTextureMap;

        varying vec4 vColor;
        varying vec3 vTextureCoord;

        void main() {
            // if (map_texture > 0.1) {
                vec4 color = texture2D(uTextureMap, vTextureCoord.xy);

                if (color.a < 0.01) discard;

                gl_FragColor = color;
            // } else {
            //     gl_FragColor = vColor;
            // }
            // gl_FragColor = vec4(vTextureCoord.xyz, 1.0);
        }
        `;

        const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        if (shaderProgram && vertexShader && fragmentShader) {
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                hflog.error("Unable to initialize shader program: " + gl.getProgramInfoLog(shaderProgram));
                this.shaderProgram = null;
            }

            this.shaderProgram = shaderProgram;

            this.aVertexLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
            this.aColorLocation = gl.getAttribLocation(shaderProgram, 'aColor');
            this.aTextureCoordLocation = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
            this.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
            this.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
            this.uColor = gl.getUniformLocation(shaderProgram, "uColor");
            this.uWorldMatrixLocation = gl.getUniformLocation(shaderProgram, "uWorldMatrix");
            this.uMapTexture = gl.getUniformLocation(shaderProgram, "map_texture");
            this.uTextureMapLocation = gl.getUniformLocation(shaderProgram, "uTextureMap");
        }
    }

    private loadShader(type: number, source: string): null | WebGLShader {
        let gl = this.renderingContext.gl;
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            hflog.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    private mainloop(timestamp: number): void {
        let self = this;
        this.t0 = this.t1;
        this.t1 = timestamp / 1000.0;
        this.dt = this.t1 - this.t0;
        if (timestamp - this.uiUpdateTime > 150) {
            this.uiUpdateTime = timestamp;
            this.updateUI();
        }
        if (this.dt < 1.0 / 30) {
            setTimeout(() => { }, 17);
        }
        window.requestAnimationFrame((t: number) => {
            self.update();
            self.display();

            self.mainloop(t);
        });
    }

    private updateUI(): void {
        // Nothing here currently...
    }

    nextLevel() : void {
        // this.world.load("./assets/crawler-tilemap-level1.txt", "./assets/crawler-entities-level1.txt");
        this.world = new MyWorld2D("./assets/crawler-tilemap-level1.txt",
        "./assets/crawler-entities-level1.txt", "./assets/crawler_spritesheet.png", 32, 32, this.renderingContext);
    }

    private update(): void {
        // The first time through will dynamically build key listener list
        // The list is physical keyboard keys, see KeyboardEvent.code documentation
        let keys = this.controls;

        let repeat = this.t1 >= this.keysUpdateTime + 0.2;
        if (keys.isKeyClick(["KeyW"]) || repeat && keys.isKeyDown(["KeyW"])) {
            let e = this.world.entities[0];
            e.updir = 0;
            if (this.world.isWalkable(e.position.clone(), e.updir)) {
                this.world.moveEntityPosition(0, 0, -1);
                this.keysUpdateTime = this.t1;
            }
        }

        if (keys.isKeyClick(["KeyD"]) || repeat && keys.isKeyDown(["KeyD"])) {
            let e = this.world.entities[0];
            e.updir = 1;
            if (this.world.isWalkable(e.position.clone(), e.updir)) {
                this.world.moveEntityPosition(0, 1, 0);
                this.keysUpdateTime = this.t1;
            }
        }

        if (keys.isKeyClick(["KeyS"]) || repeat && keys.isKeyDown(["KeyS"])) {
            let e = this.world.entities[0];
            e.updir = 2;
            if (this.world.isWalkable(e.position.clone(), e.updir)) {
                this.world.moveEntityPosition(0, 0, 1);
                this.keysUpdateTime = this.t1;
            }
        }

        if (keys.isKeyClick(["KeyA"]) || repeat && keys.isKeyDown(["KeyA"])) {
            let e = this.world.entities[0];
            e.updir = 3;
            if (this.world.isWalkable(e.position.clone(), e.updir)) {
                this.world.moveEntityPosition(0, -1, 0);
                this.keysUpdateTime = this.t1;
            }
        }

        if (keys.isKeyClick(["KeyN"])) {
            this.nextLevel();
        }

        let attack_repeat = (this.t1 >= this.keysUpdateTime + 0.4);
        if (keys.isKeyClick(["Space"]) || attack_repeat && keys.isKeyDown(["Space"])) {
            let updir = this.world.entities[0].updir;
            let pos = this.world.entities[0].position.clone();
            this.keysUpdateTime = this.t1;

            switch (updir) {
                case 0:
                    pos.y = pos.y - 1;
                    break;
                case 1:
                    pos.x = pos.x + 1;
                    break;
                case 2:
                    pos.y = pos.y + 1;
                    break;
                case 3:
                    pos.x = pos.x - 1;
                    break;
                default:
                    hflog.error('Unknown updir assigned to effect.');
                    break;
            }

            this.world.addEffect([24, 25, 26, 27], pos, updir, 1);

            let i = this.world.effects.length - 1;
            if (attack_repeat) {
                switch (updir) {
                    case 0:
                    case 2:
                        this.world.effects[i].transform = Matrix4.makeScale(-1, 1, 0);
                    case 1:
                    case 3:
                        this.world.effects[i].transform = Matrix4.makeScale(1, -1, 0);
                }
            }
        }

        if (keys.isKeyClick(["KeyZ"])) {
            let pos = this.world.entities[0].position;
            hflog.log('pos (' + pos.x + ', ' + pos.y + ')');
        }

        if (this.world.loaded && this.world.isExit(this.world.entities[0].position))
            this.nextLevel();
    }

    private display(): void {
        let gl = this.renderingContext.gl;

        let sine = Math.abs(Math.sin(this.t1));
        gl.clearColor(sine * 0.1, sine * 0.1, sine * 0.3, 1.0);

        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let p = Matrix4.makeRowMajor(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        let c = Matrix4.makeIdentity();

        gl.useProgram(this.shaderProgram);
        if (this.uProjectionMatrixLocation)
            gl.uniformMatrix4fv(this.uProjectionMatrixLocation, false, p.toColMajorArray());
        if (this.uModelViewMatrixLocation)
            gl.uniformMatrix4fv(this.uModelViewMatrixLocation, false, c.toColMajorArray());


        if (!this.world.checkDraw()) return;
        let x_scale = this.world.tileMap.wWidth/this.world.tileMap.vWidth;
        let y_scale = this.world.tileMap.wHeight/this.world.tileMap.vHeight;

        let e = this.world.entities[this.world.getEntityIndexByName("player")];
        if (!e) return;
        let x = e.position.x;
        let y = e.position.y;
        let W = this.world.tileMap.wWidth;
        let H = this.world.tileMap.wHeight;
        let vW = this.world.tileMap.vWidth;
        let vH = this.world.tileMap.vHeight;

        let w = Matrix4.makeScale(x_scale, y_scale, 0.0); // .makeTranslation(0, 0.75, 0); // makeScale(x_scale, y_scale, 0.0);
        // w.Scale(x_scale, y_scale, 0.0);


        let y_translate = ((2*y-vH)*y_scale)/H-(y_scale - 1);

        if (y_translate > y_scale - 1) {
            y_translate = y_scale - 1;
        } else if (y_translate < - (y_scale - 1)) {
            y_translate = - (y_scale - 1);
        }

        let x_translate = (x_scale - 1)-((2*x-vW)*x_scale)/W;

        if (x_translate > x_scale - 1) {
            x_translate = x_scale - 1;
        } else if (x_translate < - (x_scale - 1)) {
            x_translate = - (x_scale - 1);
        }

        w.Translate(x_translate, y_translate, 0);

        if (this.uWorldMatrixLocation) {
            gl.uniformMatrix4fv(this.uWorldMatrixLocation, false, w.toColMajorArray());
        }

        this.world.draw(gl, this.aVertexLocation, this.aColorLocation, this.aTextureCoordLocation);

        gl.useProgram(null);
    }
}