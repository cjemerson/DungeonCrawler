enum MyImageRepeatMode {
    REPEAT = 0x2901,
    CLAMP_TO_EDGE = 0x812F,
    MIRRORED_REPEAT = 0x8370
}

enum MyImageFilterMode {
    NEAREST = 0,
    BILINEAR = 1,
    TRILINEAR = 2,
    ANISOTROPIC = 3
}

class MyImage {
    pixels: Uint8ClampedArray;
    private image: HTMLImageElement | null = null;

    get loaded(): boolean { return (!this.image) ? false : this.image.complete; }
    get width(): number { return this.width_; }
    get height(): number { return this.height_; }

    constructor(private width_: number, private height_: number, makePowerOfTwo: boolean = false) {
        if (makePowerOfTwo) {
            this.width_ = 1 << ((0.5 + Math.log2(width_)) | 0);
            this.height_ = 1 << ((0.5 + Math.log2(height_)) | 0);
        }
        this.pixels = new Uint8ClampedArray(width_ * height_ * 4);
    }

    isCoordsInside(x: number, y: number): boolean {
        if (x >= 0 && x < this.width_ && y >= 0 && y < this.height_) {
            return true;
        }
        return false;
    }

    clearPixels(color: Vector4) {
        let addr = 0;
        while (addr < this.pixels.length) {
            this.pixels[addr + 0] = color.x;
            this.pixels[addr + 1] = color.y;
            this.pixels[addr + 2] = color.z;
            this.pixels[addr + 3] = color.z;
            addr += 4;
        }
    }

    setPixel(x: number, y: number, color: Vector4) {
        if (!this.isCoordsInside(x, y)) {
            return;
        }
        const addr = ((y | 0) * this.width_ + (x | 0)) << 2;
        this.pixels[addr + 0] = color.x;
        this.pixels[addr + 1] = color.y;
        this.pixels[addr + 2] = color.z;
        this.pixels[addr + 3] = color.z;
    }

    getPixel(x: number, y: number): Vector4 {
        if (!this.isCoordsInside(x, y)) {
            return new Vector4();
        }
        const addr = ((y | 0) * this.width_ + (x | 0)) << 2;
        const r = this.pixels[addr + 0];
        const g = this.pixels[addr + 1];
        const b = this.pixels[addr + 2];
        const a = this.pixels[addr + 3];
        return new Vector4(r, g, b, a);
    }

    // returns -1 if (x, y) is outside the image
    // otherwise returns the address to the rgba area in the pixels array
    getAddr(x: number, y: number): number {
        if (!this.isCoordsInside(x, y)) return -1;
        return ((y | 0) * this.width_ + (x | 0)) << 2;
    }

    static blit(
        src: MyImage, sx: number, sy: number, sw: number, sh: number,
        dst: MyImage, dx: number, dy: number, dw: number, dh: number) {
        let deltaX = sw / dw;
        let deltaY = sh / dh;
        let srcy = sy;
        for (let y = dy; y < dy + dh; y++) {
            let srcx = sx;
            for (let x = dx; x < dx + dw; x++) {
                let daddr = dst.getAddr(x, y);
                if (daddr < 0) continue;
                let saddr = src.getAddr(srcx, srcy);
                let r = 0;
                let g = 0;
                let b = 0;
                let a = 0;
                if (saddr >= 0) {
                    r = src.pixels[saddr + 0];
                    g = src.pixels[saddr + 1];
                    b = src.pixels[saddr + 2];
                    a = src.pixels[saddr + 3];
                }
                dst.pixels[daddr + 0] = r;
                dst.pixels[daddr + 1] = g;
                dst.pixels[daddr + 2] = b;
                dst.pixels[daddr + 3] = a;
                srcx += deltaX;
            }
            srcy += deltaY;
        }
    }

    load(url: string, callbackfn: (image: MyImage) => void) {
        this.image = new Image();
        let self = this;
        this.image.addEventListener("load", (e) => {
            // Once image is loaded, draw it to a canvas and read it back
            // to get an ImageData class we can copy into pixels.
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            if (self.image && ctx) {
                canvas.width = self.image.width;
                canvas.height = self.image.height;
                ctx.drawImage(self.image, 0, 0);
                let imageData = ctx.getImageData(0, 0, self.image.width, self.image.height);
                self.width_ = imageData.width;
                self.height_ = imageData.height;
                self.pixels = imageData.data;
                callbackfn(self);
                hflog.log("Loaded " + url);
            } else {
                hflog.error("Failed to create 2d context");
            }
        });
        this.image.addEventListener("abort", (e) => {
            hflog.error("Could not load " + url + "(abort)");
        });
        this.image.addEventListener("error", (e) => {
            hflog.error("Could not load " + url + "(error)");
        });
        this.image.src = url;
    }

    createTexture(gl: WebGLRenderingContext,
        repeatMode: MyImageRepeatMode = MyImageRepeatMode.CLAMP_TO_EDGE,
        filterMode: MyImageFilterMode = MyImageFilterMode.NEAREST): WebGLTexture | null {
        let texture = gl.createTexture();
        if (!texture) return null;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        let imageData = new ImageData(this.pixels, this.width_, this.height_);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        if (filterMode == MyImageFilterMode.NEAREST) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        } else if (filterMode == MyImageFilterMode.BILINEAR) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        } else if (filterMode == MyImageFilterMode.TRILINEAR) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        } else if (filterMode == MyImageFilterMode.ANISOTROPIC) {
            let error = gl.getError();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            let ext = gl.getExtension("EXT_texture_filter_anisotropic");
            if (ext) {
                var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
            }
        }
        if (repeatMode == MyImageRepeatMode.REPEAT) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        if (repeatMode == MyImageRepeatMode.CLAMP_TO_EDGE) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        if (repeatMode == MyImageRepeatMode.MIRRORED_REPEAT) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        }
        gl.generateMipmap(gl.TEXTURE_2D);
        return texture;
    }
}