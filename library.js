"use strict";
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts" />
class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(multiplicand) {
        return new Vector2(this.x * multiplicand, this.y * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector2();
        return new Vector2(this.x / divisor, this.y / divisor);
    }
    neg() {
        return new Vector2(-this.x, -this.y);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, 0.0);
    }
    toVector4() {
        return new Vector4(this.x, this.y, 0.0, 0.0);
    }
    project() {
        return this.x / this.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector2();
        else
            len = Math.sqrt(len);
        return new Vector2(this.x / len, this.y / len);
    }
    static make(x, y) {
        return new Vector2(x, y);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
        }
        return v;
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./GTE.ts" />
class Vector3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get r() { return this.x; }
    get g() { return this.y; }
    get b() { return this.z; }
    set r(r) { this.x = r; }
    set g(g) { this.g = g; }
    set b(b) { this.z = b; }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    reset(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    static makeFromSpherical(theta, phi) {
        return new Vector3(Math.cos(phi) * Math.cos(theta), Math.sin(phi), -Math.cos(phi) * Math.sin(theta));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // theta is inclination away from positive y-axis, and phi is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalISO(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(thetaInRadians) * Math.cos(phiInRadians), rho * Math.cos(thetaInRadians), rho * Math.sin(thetaInRadians) * Math.sin(phiInRadians));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // phi is inclination away from positive y-axis, and theta is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalMath(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(phiInRadians) * Math.sin(thetaInRadians), rho * Math.cos(phiInRadians), rho * Math.sin(phiInRadians) * Math.cos(thetaInRadians));
    }
    // theta represents angle from +x axis on xz plane going counterclockwise
    // phi represents angle from xz plane going towards +y axis
    setFromSpherical(theta, phi) {
        this.x = Math.cos(theta) * Math.cos(phi);
        this.y = Math.sin(phi);
        this.z = -Math.sin(theta) * Math.cos(phi);
        return this;
    }
    get theta() {
        return Math.atan2(this.x, -this.z) + ((this.z <= 0.0) ? 0.0 : 2.0 * Math.PI);
    }
    get phi() {
        return Math.asin(this.y);
    }
    static make(x, y, z) {
        return new Vector3(x, y, z);
    }
    static makeUnit(x, y, z) {
        return (new Vector3(x, y, z)).norm();
    }
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(multiplicand) {
        return new Vector3(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector3();
        return new Vector3(this.x / divisor, this.y / divisor, this.z / divisor);
    }
    neg() {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    // multiplicative inverse (1/x)
    reciprocal() {
        return new Vector3(1.0 / this.x, 1.0 / this.y, 1.0 / this.z);
    }
    pow(power) {
        return new Vector3(Math.pow(this.x, power), Math.pow(this.y, power), Math.pow(this.z, power));
    }
    compdiv(divisor) {
        return new Vector3(this.x / divisor.x, this.y / divisor.y, this.z / divisor.z);
    }
    compmul(multiplicand) {
        return new Vector3(this.x * multiplicand.x, this.y * multiplicand.y, this.z * multiplicand.z);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector4(w) {
        return new Vector4(this.x, this.y, this.z, w);
    }
    project() {
        return new Vector2(this.x / this.z, this.y / this.z);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }
    normalize() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }
    get(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
        }
        return 0.0;
    }
    set(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                return;
            case 1:
                this.y = value;
                return;
            case 2:
                this.z = value;
                return;
        }
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static cross(a, b) {
        return new Vector3(a.y * b.z - b.y * a.z, a.z * b.x - b.z * a.x, a.x * b.y - b.x * a.y);
    }
    static add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static sub(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static mul(a, b) {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    static div(a, b) {
        return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts" />
class Vector4 {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }
    reset(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    add(v) {
        return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }
    sub(v) {
        return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }
    mul(multiplicand) {
        return new Vector4(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand, this.w * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector4();
        return new Vector4(this.x / divisor, this.y / divisor, this.z / divisor, this.w / divisor);
    }
    neg() {
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z, this.w]);
    }
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, this.z);
    }
    project() {
        return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector4();
        else
            len = Math.sqrt(len);
        return new Vector4(this.x / len, this.y / len, this.z / len, this.w / len);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0, 0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
            v.z /= len;
            v.w /= len;
        }
        return v;
    }
    static make(x, y, z, w) {
        return new Vector4(x, y, z, w);
    }
    static makeUnit(x, y, z, w) {
        return (new Vector4(x, y, z, w)).norm();
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts" />
class Matrix2 {
    constructor(m11, m21, m12, m22) {
        this.m11 = m11;
        this.m21 = m21;
        this.m12 = m12;
        this.m22 = m22;
    }
    static makeIdentity() {
        return new Matrix2(1, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix2(0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m12, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static makeRowMajor(m11, m12, m21, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[2], v[1], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[1], v[2], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static makeScale(x, y) {
        return Matrix2.makeRowMajor(x, 0, 0, y);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        return Matrix2.makeRowMajor(c, -s, s, c);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21,
            this.m12, this.m22
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12,
            this.m21, this.m22
        ];
    }
    static multiply(m1, m2) {
        return new Matrix2(m1.m11 * m2.m11 + m1.m21 * m2.m12, m1.m11 * m2.m21 + m1.m21 * m2.m22, m1.m12 * m2.m11 + m1.m22 * m2.m12, m1.m12 * m2.m21 + m1.m22 * m2.m22);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m12 = m.m12;
        this.m22 = m.m22;
        return this;
    }
    concat(m) {
        this.copy(Matrix2.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector2(this.m11 * v.x + this.m12 * v.y, this.m21 * v.x + this.m22 * v.y);
    }
    asInverse() {
        var tmpD = 1.0 / (this.m11 * this.m22 - this.m12 * this.m21);
        return Matrix2.makeRowMajor(this.m22 * tmpD, -this.m12 * tmpD, -this.m21 * tmpD, this.m11 * tmpD);
    }
    asTranspose() {
        return Matrix2.makeRowMajor(this.m11, this.m21, this.m12, this.m22);
    }
} // class Matrix2
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts"/>
class Matrix3 {
    constructor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
    }
    static makeIdentity() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static makeRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[3], v[6], v[1], v[4], v[7], v[2], v[5], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeScale(x, y, z) {
        return Matrix3.makeRowMajor(x, 0, 0, 0, y, 0, 0, 0, z);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix3.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix3.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix3.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix3.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix3.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix3.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix3.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21, this.m31,
            this.m12, this.m22, this.m32,
            this.m13, this.m23, this.m33
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33
        ];
    }
    static multiply(m1, m2) {
        return new Matrix3(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33);
    }
    LoadIdentity() {
        return this.copy(Matrix3.makeIdentity());
    }
    MultMatrix(m) {
        return this.copy(Matrix3.multiply(this, m));
    }
    LoadColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    LoadRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    toMatrix4() {
        return Matrix4.makeRowMajor(this.m11, this.m12, this.m13, 0.0, this.m21, this.m22, this.m23, 0.0, this.m31, this.m32, this.m33, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        return this;
    }
    clone() {
        return Matrix3.makeRowMajor(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
    concat(m) {
        this.copy(Matrix3.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector3(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    }
    asInverse() {
        var tmpA = this.m22 * this.m33 - this.m23 * this.m32;
        var tmpB = this.m21 * this.m32 - this.m22 * this.m31;
        var tmpC = this.m23 * this.m31 - this.m21 * this.m33;
        var tmpD = 1.0 / (this.m11 * tmpA + this.m12 * tmpC + this.m13 * tmpB);
        return new Matrix3(tmpA * tmpD, (this.m13 * this.m32 - this.m12 * this.m33) * tmpD, (this.m12 * this.m23 - this.m13 * this.m22) * tmpD, tmpC * tmpD, (this.m11 * this.m33 - this.m13 * this.m31) * tmpD, (this.m13 * this.m21 - this.m11 * this.m23) * tmpD, tmpB * tmpD, (this.m12 * this.m31 - this.m11 * this.m32) * tmpD, (this.m11 * this.m22 - this.m12 * this.m21) * tmpD);
    }
    asTranspose() {
        return new Matrix3(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
} // class Matrix3
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
///<reference path="GTE.ts"/>
class Matrix4 {
    constructor(m11 = 1, m21 = 0, m31 = 0, m41 = 0, m12 = 0, m22 = 1, m32 = 0, m42 = 0, m13 = 0, m23 = 0, m33 = 1, m43 = 0, m14 = 0, m24 = 0, m34 = 0, m44 = 1) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m41 = m41;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m42 = m42;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
        this.m43 = m43;
        this.m14 = m14;
        this.m24 = m24;
        this.m34 = m34;
        this.m44 = m44;
    }
    copy(m) {
        return this.LoadMatrix(m);
    }
    clone() {
        return new Matrix4(this.m11, this.m21, this.m31, this.m41, this.m12, this.m22, this.m32, this.m42, this.m13, this.m23, this.m33, this.m43, this.m14, this.m24, this.m34, this.m44);
    }
    row(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m12, this.m13, this.m14);
            case 1: return new Vector4(this.m21, this.m22, this.m23, this.m24);
            case 2: return new Vector4(this.m31, this.m32, this.m33, this.m34);
            case 3: return new Vector4(this.m41, this.m42, this.m43, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    col(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m21, this.m31, this.m41);
            case 1: return new Vector4(this.m12, this.m22, this.m32, this.m42);
            case 2: return new Vector4(this.m13, this.m23, this.m33, this.m43);
            case 3: return new Vector4(this.m14, this.m24, this.m34, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    row3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m12, this.m13);
            case 1: return new Vector3(this.m21, this.m22, this.m23);
            case 2: return new Vector3(this.m31, this.m32, this.m33);
            case 3: return new Vector3(this.m41, this.m42, this.m43);
        }
        return new Vector3(0, 0, 0);
    }
    col3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m21, this.m31);
            case 1: return new Vector3(this.m12, this.m22, this.m32);
            case 2: return new Vector3(this.m13, this.m23, this.m33);
            case 3: return new Vector3(this.m14, this.m24, this.m34);
        }
        return new Vector3(0, 0, 0);
    }
    diag3() {
        return new Vector3(this.m11, this.m22, this.m33);
    }
    LoadRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadIdentity() {
        return this.LoadMatrix(Matrix4.makeIdentity());
    }
    Translate(x, y, z) {
        return this.MultMatrix(Matrix4.makeTranslation(x, y, z));
    }
    Rotate(angleInDegrees, x, y, z) {
        return this.MultMatrix(Matrix4.makeRotation(angleInDegrees, x, y, z));
    }
    Scale(sx, sy, sz) {
        return this.MultMatrix(Matrix4.makeScale(sx, sy, sz));
    }
    LookAt(eye, center, up) {
        return this.MultMatrix(Matrix4.makeLookAt2(eye, center, up));
    }
    Frustum(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeFrustum(left, right, bottom, top, near, far));
    }
    Ortho(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeOrtho(left, right, bottom, top, near, far));
    }
    Ortho2D(left, right, bottom, top) {
        return this.MultMatrix(Matrix4.makeOrtho2D(left, right, bottom, top));
    }
    PerspectiveX(fovx, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveX(fovx, aspect, near, far));
    }
    PerspectiveY(fovy, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveY(fovy, aspect, near, far));
    }
    ShadowBias() {
        return this.MultMatrix(Matrix4.makeShadowBias());
    }
    CubeFaceMatrix(face) {
        return this.MultMatrix(Matrix4.makeCubeFaceMatrix(face));
    }
    static makeIdentity() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static makeRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[4], v[8], v[12], v[1], v[5], v[9], v[13], v[2], v[6], v[10], v[14], v[3], v[7], v[11], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[12], v[13], v[14], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeTranslation(x, y, z) {
        return Matrix4.makeRowMajor(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    }
    static makeScale(x, y, z) {
        return Matrix4.makeRowMajor(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix4.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0.0, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0.0, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    static makeOrtho(left, right, bottom, top, near, far) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(far + near) / (far - near);
        return Matrix4.makeRowMajor(2 / (right - left), 0, 0, tx, 0, 2 / (top - bottom), 0, ty, 0, 0, -2 / (far - near), tz, 0, 0, 0, 1);
    }
    static makeOrtho2D(left, right, bottom, top) {
        return Matrix4.makeOrtho(left, right, bottom, top, -1, 1);
    }
    static makeFrustum(left, right, bottom, top, near, far) {
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(far + near) / (far - near);
        var D = -2 * far * near / (far - near);
        return Matrix4.makeRowMajor(2 * near / (right - left), 0, A, 0, 0, 2 * near / (top - bottom), B, 0, 0, 0, C, D, 0, 0, -1, 0);
    }
    static makePerspectiveY(fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(Math.PI * fovy / 360.0);
        return Matrix4.makeRowMajor(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makePerspectiveX(fovx, aspect, near, far) {
        var f = 1.0 / Math.tan(Math.PI * fovx / 360.0);
        return Matrix4.makeRowMajor(f, 0, 0, 0, 0, f * aspect, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makeLookAt(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1), Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z));
    }
    static makeLookAt2(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z), Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1));
    }
    static makeShadowBias() {
        return Matrix4.makeRowMajor(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix4.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix4.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix4.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix4.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix4.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix4.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    toColMajorArray() {
        return [
            this.m11, this.m21, this.m31, this.m41,
            this.m12, this.m22, this.m32, this.m42,
            this.m13, this.m23, this.m33, this.m43,
            this.m14, this.m24, this.m34, this.m44
        ];
    }
    toRowMajorArray() {
        return [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44
        ];
    }
    static multiply3(a, b, c) {
        return Matrix4.multiply(a, Matrix4.multiply(b, c));
    }
    static multiply(a, b) {
        return new Matrix4(a.m11 * b.m11 + a.m21 * b.m12 + a.m31 * b.m13 + a.m41 * b.m14, a.m11 * b.m21 + a.m21 * b.m22 + a.m31 * b.m23 + a.m41 * b.m24, a.m11 * b.m31 + a.m21 * b.m32 + a.m31 * b.m33 + a.m41 * b.m34, a.m11 * b.m41 + a.m21 * b.m42 + a.m31 * b.m43 + a.m41 * b.m44, a.m12 * b.m11 + a.m22 * b.m12 + a.m32 * b.m13 + a.m42 * b.m14, a.m12 * b.m21 + a.m22 * b.m22 + a.m32 * b.m23 + a.m42 * b.m24, a.m12 * b.m31 + a.m22 * b.m32 + a.m32 * b.m33 + a.m42 * b.m34, a.m12 * b.m41 + a.m22 * b.m42 + a.m32 * b.m43 + a.m42 * b.m44, a.m13 * b.m11 + a.m23 * b.m12 + a.m33 * b.m13 + a.m43 * b.m14, a.m13 * b.m21 + a.m23 * b.m22 + a.m33 * b.m23 + a.m43 * b.m24, a.m13 * b.m31 + a.m23 * b.m32 + a.m33 * b.m33 + a.m43 * b.m34, a.m13 * b.m41 + a.m23 * b.m42 + a.m33 * b.m43 + a.m43 * b.m44, a.m14 * b.m11 + a.m24 * b.m12 + a.m34 * b.m13 + a.m44 * b.m14, a.m14 * b.m21 + a.m24 * b.m22 + a.m34 * b.m23 + a.m44 * b.m24, a.m14 * b.m31 + a.m24 * b.m32 + a.m34 * b.m33 + a.m44 * b.m34, a.m14 * b.m41 + a.m24 * b.m42 + a.m34 * b.m43 + a.m44 * b.m44);
    }
    LoadMatrix(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m41 = m.m41;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m42 = m.m42;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        this.m43 = m.m43;
        this.m14 = m.m14;
        this.m24 = m.m24;
        this.m34 = m.m34;
        this.m44 = m.m44;
        return this;
    }
    MultMatrix(m) {
        this.LoadMatrix(Matrix4.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector4(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z + this.m14 * v.w, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z + this.m24 * v.w, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z + this.m34 * v.w, this.m41 * v.x + this.m42 * v.y + this.m43 * v.z + this.m44 * v.w);
    }
    asInverse() {
        var tmp1 = this.m32 * this.m43 - this.m33 * this.m42;
        var tmp2 = this.m32 * this.m44 - this.m34 * this.m42;
        var tmp3 = this.m33 * this.m44 - this.m34 * this.m43;
        var tmp4 = this.m22 * tmp3 - this.m23 * tmp2 + this.m24 * tmp1;
        var tmp5 = this.m31 * this.m42 - this.m32 * this.m41;
        var tmp6 = this.m31 * this.m43 - this.m33 * this.m41;
        var tmp7 = -this.m21 * tmp1 + this.m22 * tmp6 - this.m23 * tmp5;
        var tmp8 = this.m31 * this.m44 - this.m34 * this.m41;
        var tmp9 = this.m21 * tmp2 - this.m22 * tmp8 + this.m24 * tmp5;
        var tmp10 = -this.m21 * tmp3 + this.m23 * tmp8 - this.m24 * tmp6;
        var tmp11 = 1 / (this.m11 * tmp4 + this.m12 * tmp10 + this.m13 * tmp9 + this.m14 * tmp7);
        var tmp12 = this.m22 * this.m43 - this.m23 * this.m42;
        var tmp13 = this.m22 * this.m44 - this.m24 * this.m42;
        var tmp14 = this.m23 * this.m44 - this.m24 * this.m43;
        var tmp15 = this.m22 * this.m33 - this.m23 * this.m32;
        var tmp16 = this.m22 * this.m34 - this.m24 * this.m32;
        var tmp17 = this.m23 * this.m34 - this.m24 * this.m33;
        var tmp18 = this.m21 * this.m43 - this.m23 * this.m41;
        var tmp19 = this.m21 * this.m44 - this.m24 * this.m41;
        var tmp20 = this.m21 * this.m33 - this.m23 * this.m31;
        var tmp21 = this.m21 * this.m34 - this.m24 * this.m31;
        var tmp22 = this.m21 * this.m42 - this.m22 * this.m41;
        var tmp23 = this.m21 * this.m32 - this.m22 * this.m31;
        return new Matrix4(tmp4 * tmp11, (-this.m12 * tmp3 + this.m13 * tmp2 - this.m14 * tmp1) * tmp11, (this.m12 * tmp14 - this.m13 * tmp13 + this.m14 * tmp12) * tmp11, (-this.m12 * tmp17 + this.m13 * tmp16 - this.m14 * tmp15) * tmp11, tmp10 * tmp11, (this.m11 * tmp3 - this.m13 * tmp8 + this.m14 * tmp6) * tmp11, (-this.m11 * tmp14 + this.m13 * tmp19 - this.m14 * tmp18) * tmp11, (this.m11 * tmp17 - this.m13 * tmp21 + this.m14 * tmp20) * tmp11, tmp9 * tmp11, (-this.m11 * tmp2 + this.m12 * tmp8 - this.m14 * tmp5) * tmp11, (this.m11 * tmp13 - this.m12 * tmp19 + this.m14 * tmp22) * tmp11, (-this.m11 * tmp16 + this.m12 * tmp21 - this.m14 * tmp23) * tmp11, tmp7 * tmp11, (this.m11 * tmp1 - this.m12 * tmp6 + this.m13 * tmp5) * tmp11, (-this.m11 * tmp12 + this.m12 * tmp18 - this.m13 * tmp22) * tmp11, (this.m11 * tmp15 - this.m12 * tmp20 + this.m13 * tmp23) * tmp11);
    }
    asTranspose() {
        return new Matrix4(this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44);
    }
} // class Matrix4
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./Vector2.ts" />
/// <reference path="./Vector3.ts" />
/// <reference path="./Vector4.ts" />
/// <reference path="./Matrix2.ts" />
/// <reference path="./Matrix3.ts" />
/// <reference path="./Matrix4.ts" />
var GTE;
(function (GTE) {
    function clamp(x, a, b) {
        return x < a ? a : x > b ? b : x;
    }
    GTE.clamp = clamp;
    // 0 <= mix <= 1
    function lerp(a, b, mix) {
        return mix * a + (1 - mix) * b;
    }
    GTE.lerp = lerp;
    function distancePointLine2(point, linePoint1, linePoint2) {
        let v = linePoint2.sub(linePoint1);
        let d = v.length();
        let n = Math.abs(v.y * point.x - v.x * point.y + linePoint2.x * linePoint1.y - linePoint2.y * linePoint1.x);
        if (d != 0.0)
            return n / d;
        return 1e30;
    }
    GTE.distancePointLine2 = distancePointLine2;
    function gaussian(x, center, sigma) {
        let t = (x - center) / sigma;
        return 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * t * t);
        //return 1 / (Math.sqrt(2.0 * sigma * sigma * Math.PI)) * Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
    }
    GTE.gaussian = gaussian;
    function min3(a, b, c) {
        return Math.min(Math.min(a, b), c);
    }
    GTE.min3 = min3;
    function max3(a, b, c) {
        return Math.max(Math.max(a, b), c);
    }
    GTE.max3 = max3;
})(GTE || (GTE = {}));
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./FxRenderingContext.ts"/>
class RenderConfig {
    constructor(_context, _vertShaderSource, _fragShaderSource) {
        this._context = _context;
        this._vertShaderSource = _vertShaderSource;
        this._fragShaderSource = _fragShaderSource;
        this._isCompiled = false;
        this._isLinked = false;
        this._vertShader = null;
        this._fragShader = null;
        this._program = null;
        this._vertShaderInfoLog = "";
        this._fragShaderInfoLog = "";
        this._vertShaderCompileStatus = false;
        this._fragShaderCompileStatus = false;
        this._programInfoLog = "";
        this._programLinkStatus = false;
        this.uniforms = new Map();
        this.uniformInfo = new Map();
        this.useDepthTest = true;
        this.depthTest = WebGLRenderingContext.LESS;
        this.depthMask = true;
        this.usesFBO = false;
        this.renderShadowMap = false;
        this.renderGBuffer = false;
        this.Reset(this._vertShaderSource, this._fragShaderSource);
    }
    get usable() { return this.IsCompiledAndLinked(); }
    IsCompiledAndLinked() {
        if (this._isCompiled && this._isLinked)
            return true;
        return false;
    }
    Use() {
        let gl = this._context.gl;
        gl.useProgram(this._program);
        if (this.useDepthTest) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(this.depthTest);
        }
        gl.depthMask(this.depthMask);
    }
    Restore() {
        let gl = this._context.gl;
        gl.useProgram(null);
        if (this.useDepthTest) {
            gl.disable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
        }
        gl.depthMask(true);
    }
    SetMatrix4f(uniformName, m) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniformMatrix4fv(location, false, m.toColMajorArray());
        }
    }
    SetUniform1i(uniformName, x) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform1i(location, x);
        }
    }
    SetUniform1f(uniformName, x) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform1f(location, x);
        }
    }
    SetUniform2f(uniformName, v) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform2fv(location, v.toFloat32Array());
        }
    }
    SetUniform3f(uniformName, v) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform3fv(location, v.toFloat32Array());
        }
    }
    SetUniform4f(uniformName, v) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location) {
            gl.uniform4fv(location, v.toFloat32Array());
        }
    }
    GetAttribLocation(name) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        return gl.getAttribLocation(this._program, name);
    }
    GetUniformLocation(name) {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let uloc = gl.getUniformLocation(this._program, name);
        if (!uloc)
            return null;
        return uloc;
    }
    Reset(vertShaderSource, fragShaderSource) {
        let gl = this._context.gl;
        let vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (vertShader) {
            gl.shaderSource(vertShader, vertShaderSource);
            gl.compileShader(vertShader);
            let status = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
            let infoLog = null;
            if (!status) {
                infoLog = gl.getShaderInfoLog(vertShader);
                hflog.error("VERTEX SHADER COMPILE ERROR:");
                hflog.error(infoLog ? infoLog : "");
                hflog.error("--------------------------------------------");
                let errorElement = document.getElementById("errors");
                if (!errorElement && infoLog) {
                    let newDiv = document.createElement("div");
                    newDiv.appendChild(document.createTextNode("Vertex shader info log"));
                    newDiv.appendChild(document.createElement("br"));
                    newDiv.appendChild(document.createTextNode(infoLog));
                    let pre = document.createElement("pre");
                    pre.textContent = this._vertShaderSource;
                    pre.style.width = "50%";
                    newDiv.appendChild(pre);
                    document.body.appendChild(newDiv);
                }
            }
            if (status)
                this._vertShaderCompileStatus = true;
            if (infoLog)
                this._vertShaderInfoLog = infoLog;
            this._vertShader = vertShader;
        }
        else {
            return false;
        }
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (fragShader) {
            gl.shaderSource(fragShader, fragShaderSource);
            gl.compileShader(fragShader);
            let status = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
            let infoLog = null;
            if (!status) {
                infoLog = gl.getShaderInfoLog(fragShader);
                hflog.error("FRAGMENT SHADER COMPILE ERROR:");
                hflog.error(infoLog ? infoLog : "");
                hflog.error("--------------------------------------------");
                let errorElement = document.getElementById("errors");
                if (!errorElement && infoLog) {
                    let newDiv = document.createElement("div");
                    newDiv.appendChild(document.createTextNode("Fragment shader info log"));
                    newDiv.appendChild(document.createElement("br"));
                    newDiv.appendChild(document.createTextNode(infoLog));
                    let pre = document.createElement("pre");
                    pre.textContent = this._fragShaderSource;
                    pre.style.width = "50%";
                    newDiv.appendChild(pre);
                    document.body.appendChild(newDiv);
                }
            }
            if (status)
                this._fragShaderCompileStatus = true;
            if (infoLog)
                this._fragShaderInfoLog = infoLog;
            this._fragShader = fragShader;
        }
        else {
            return false;
        }
        if (this._vertShaderCompileStatus && this._fragShaderCompileStatus) {
            this._isCompiled = true;
            this._program = gl.createProgram();
            if (this._program) {
                gl.attachShader(this._program, this._vertShader);
                gl.attachShader(this._program, this._fragShader);
                gl.linkProgram(this._program);
                if (gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
                    this._programLinkStatus = true;
                    this._isLinked = true;
                }
                else {
                    this._programLinkStatus = false;
                    let infoLog = gl.getProgramInfoLog(this._program);
                    console.error("PROGRAM LINK ERROR:");
                    console.error(infoLog);
                    console.error("--------------------------------------------");
                    if (infoLog) {
                        this._programInfoLog = infoLog;
                        let errorElement = document.getElementById("errors");
                        if (!errorElement && infoLog) {
                            let newDiv = document.createElement("div");
                            newDiv.appendChild(document.createTextNode("PROGRAM INFO LOG"));
                            newDiv.appendChild(document.createElement("br"));
                            newDiv.appendChild(document.createTextNode(infoLog));
                            document.body.appendChild(newDiv);
                        }
                    }
                }
            }
        }
        else {
            return false;
        }
        this.updateActiveUniforms();
        return true;
    }
    updateActiveUniforms() {
        let gl = this._context.gl;
        if (this._program == null) {
            hflog.log('this._program is null (in RenderConfig.ts');
            throw "bad";
        }
        let numUniforms = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        this.uniforms.clear();
        this.uniformInfo.clear();
        for (let i = 0; i < numUniforms; i++) {
            let uniform = gl.getActiveUniform(this._program, i);
            if (!uniform)
                continue;
            this.uniformInfo.set(uniform.name, uniform);
            this.uniforms.set(uniform.name, gl.getUniformLocation(this._program, uniform.name));
        }
        return true;
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./FxRenderingContext.ts" />
/// <reference path="./RenderConfig.ts" />
var Utils;
(function (Utils) {
    // return last part of the url name ignoring possible ending slash
    function GetURLResource(url) {
        let parts = url.split('/');
        let lastSection = parts.pop() || parts.pop();
        if (lastSection) {
            return lastSection;
        }
        else {
            return "unknown";
        }
    }
    Utils.GetURLResource = GetURLResource;
    function GetURLPath(url) {
        let parts = url.split('/');
        if (!parts.pop())
            parts.pop();
        let path = parts.join("/") + "/";
        if (path) {
            return path;
        }
        else {
            return "";
        }
    }
    Utils.GetURLPath = GetURLPath;
    function IsExtension(sourceString, extensionWithDot) {
        let start = sourceString.length - extensionWithDot.length - 1;
        if (start >= 0 && sourceString.substr(start, extensionWithDot.length) == extensionWithDot) {
            return true;
        }
        return false;
    }
    Utils.IsExtension = IsExtension;
    function GetExtension(sourceString) {
        let position = sourceString.lastIndexOf(".");
        if (position >= 0) {
            return sourceString.substr(position + 1).toLowerCase();
        }
        return "";
    }
    Utils.GetExtension = GetExtension;
    class ShaderLoader {
        constructor(vertShaderUrl, fragShaderUrl, callbackfn) {
            this.vertShaderUrl = vertShaderUrl;
            this.fragShaderUrl = fragShaderUrl;
            this.callbackfn = callbackfn;
            this.vertLoaded = false;
            this.fragLoaded = false;
            this.vertFailed = false;
            this.fragFailed = false;
            this.vertShaderSource = "";
            this.fragShaderSource = "";
            let self = this;
            let vertXHR = new XMLHttpRequest();
            vertXHR.addEventListener("load", (e) => {
                self.vertShaderSource = vertXHR.responseText;
                self.vertLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            vertXHR.addEventListener("abort", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            });
            vertXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            });
            vertXHR.open("GET", vertShaderUrl);
            vertXHR.send();
            let fragXHR = new XMLHttpRequest();
            fragXHR.addEventListener("load", (e) => {
                self.fragShaderSource = fragXHR.responseText;
                self.fragLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            fragXHR.addEventListener("abort", (e) => {
                self.fragFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            });
            fragXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            });
            fragXHR.open("GET", fragShaderUrl);
            fragXHR.send();
        }
        get failed() { return this.vertFailed || this.fragFailed; }
        get loaded() { return this.vertLoaded && this.fragLoaded; }
    }
    Utils.ShaderLoader = ShaderLoader;
    class TextFileLoader {
        constructor(url, callbackfn, parameter = 0) {
            this.callbackfn = callbackfn;
            this._loaded = false;
            this._failed = false;
            this.data = "";
            this.name = GetURLResource(url);
            let self = this;
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", (e) => {
                if (!xhr.responseText) {
                    self._failed = true;
                    self.data = "unknown";
                }
                else {
                    self.data = xhr.responseText;
                }
                self._loaded = true;
                callbackfn(self.data, self.name, parameter);
                hflog.log("Loaded " + url);
            });
            xhr.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.open("GET", url);
            xhr.send();
        }
        get loaded() { return this._loaded; }
        get failed() { return this._failed; }
    }
    Utils.TextFileLoader = TextFileLoader;
    class ImageFileLoader {
        constructor(url, callbackfn, parameter = 0) {
            this.callbackfn = callbackfn;
            this._loaded = false;
            this._failed = false;
            this.image = new Image();
            this.name = GetURLResource(url);
            let self = this;
            this.image.addEventListener("load", (e) => {
                self._loaded = true;
                callbackfn(self.image, this.name, parameter);
            });
            this.image.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.src = url;
        }
        get loaded() { return this._loaded; }
        get failed() { return this._failed; }
    }
    Utils.ImageFileLoader = ImageFileLoader;
    function SeparateCubeMapImages(image, images) {
        if (image.width != 6 * image.height) {
            return;
        }
        // images are laid out: +X, -X, +Y, -Y, +Z, -Z
        let canvas = document.createElement("canvas");
        if (canvas) {
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(image, 0, 0);
                for (let i = 0; i < 6; i++) {
                    images[i] = ctx.getImageData(i * image.height, 0, image.height, image.height);
                }
            }
        }
    }
    Utils.SeparateCubeMapImages = SeparateCubeMapImages;
    function niceTimestamp(timestamp) {
        return (Math.round(1000.0 * timestamp) / 1000.0).toString() + "ms";
    }
    Utils.niceTimestamp = niceTimestamp;
    function niceFramesPerSecond(t0, t1) {
        let s = (t1 - t0);
        return Math.round(1.0 / s).toString() + "fps";
    }
    Utils.niceFramesPerSecond = niceFramesPerSecond;
    function niceDuration(t0, t1) {
        return ((Math.round(1000.0 * (t1 - t0))) / 1000.0).toString() + "ms";
    }
    Utils.niceDuration = niceDuration;
    function round3(x) {
        return Math.round(x * 1000.0) / 1000.0;
    }
    Utils.round3 = round3;
    function round3str(x) {
        return (Math.round(x * 1000.0) / 1000.0).toString();
    }
    Utils.round3str = round3str;
    function niceVector(v) {
        return "(" + round3str(v.x) + ", " + round3str(v.y) + ", " + round3str(v.z) + ")";
    }
    Utils.niceVector = niceVector;
    function niceNumber(x, digits) {
        let t = Math.pow(10.0, digits);
        return (Math.round(x * t) / t).toString();
    }
    Utils.niceNumber = niceNumber;
    function niceMatrix4(m) {
        return "("
            + round3str(m.m11) + ", " + round3str(m.m12) + ", " + round3str(m.m13) + ", " + round3str(m.m14) + ", "
            + round3str(m.m21) + ", " + round3str(m.m22) + ", " + round3str(m.m23) + ", " + round3str(m.m24) + ", "
            + round3str(m.m31) + ", " + round3str(m.m32) + ", " + round3str(m.m33) + ", " + round3str(m.m34) + ", "
            + round3str(m.m41) + ", " + round3str(m.m42) + ", " + round3str(m.m43) + ", " + round3str(m.m44)
            + ")";
    }
    Utils.niceMatrix4 = niceMatrix4;
    class GLTypeInfo {
        constructor(type, baseType, components, sizeOfType) {
            this.type = type;
            this.baseType = baseType;
            this.components = components;
            this.sizeOfType = sizeOfType;
        }
        CreateArray(size) {
            switch (this.type) {
                case WebGLRenderingContext.FLOAT:
                case WebGLRenderingContext.FLOAT_VEC2:
                case WebGLRenderingContext.FLOAT_VEC3:
                case WebGLRenderingContext.FLOAT_VEC4:
                case WebGLRenderingContext.FLOAT_MAT2:
                case WebGLRenderingContext.FLOAT_MAT3:
                case WebGLRenderingContext.FLOAT_MAT4:
                    return new Float32Array(size);
                case WebGLRenderingContext.INT:
                case WebGLRenderingContext.INT_VEC2:
                case WebGLRenderingContext.INT_VEC3:
                case WebGLRenderingContext.INT_VEC4:
                    return new Int32Array(size);
                case WebGLRenderingContext.SHORT:
                    return new Int16Array(size);
                case WebGLRenderingContext.UNSIGNED_INT:
                    return new Uint32Array(size);
                case WebGLRenderingContext.UNSIGNED_SHORT:
                    return new Uint16Array(size);
                case WebGLRenderingContext.UNSIGNED_BYTE:
                    return new Uint8ClampedArray(size);
                case WebGLRenderingContext.BOOL:
                    return new Uint32Array(size);
            }
            return null;
        }
    }
    Utils.WebGLTypeInfo = new Map([
        [WebGLRenderingContext.BYTE, new GLTypeInfo(WebGLRenderingContext.BYTE, WebGLRenderingContext.BYTE, 1, 1)],
        [WebGLRenderingContext.UNSIGNED_BYTE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_BYTE, WebGLRenderingContext.UNSIGNED_BYTE, 1, 1)],
        [WebGLRenderingContext.SHORT, new GLTypeInfo(WebGLRenderingContext.SHORT, WebGLRenderingContext.SHORT, 1, 2)],
        [WebGLRenderingContext.UNSIGNED_SHORT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_SHORT, WebGLRenderingContext.UNSIGNED_SHORT, 1, 2)],
        [WebGLRenderingContext.INT, new GLTypeInfo(WebGLRenderingContext.INT, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.UNSIGNED_INT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        [WebGLRenderingContext.BOOL, new GLTypeInfo(WebGLRenderingContext.BOOL, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.FLOAT, new GLTypeInfo(WebGLRenderingContext.FLOAT, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.FLOAT_VEC2, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC2, WebGLRenderingContext.FLOAT, 2, 4)],
        [WebGLRenderingContext.FLOAT_VEC3, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC3, WebGLRenderingContext.FLOAT, 3, 4)],
        [WebGLRenderingContext.FLOAT_VEC4, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC4, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3, WebGLRenderingContext.FLOAT, 9, 4)],
        [WebGLRenderingContext.FLOAT_MAT4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4, WebGLRenderingContext.FLOAT, 16, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x3, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x4, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x2, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x4, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x2, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x3, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.SAMPLER_1D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_1D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_2D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_3D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_3D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_CUBE, new GLTypeInfo(WebGLRenderingContext.SAMPLER_CUBE, WebGLRenderingContext.FLOAT, 1, 4)],
    ]);
})(Utils || (Utils = {}));
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="../gte/GTE.ts" />
/// <reference path="Utils.ts" />
/// <reference path="RenderConfig.ts" />
/// // <reference path="Scenegraph.ts" />
/// // <reference path="IndexedGeometryMesh.ts" />
/// // <reference path="Texture.ts" />
/// // <reference path="MaterialLibrary.ts" />
class FxRenderingContext {
    constructor(width = 512, height = 384, id = "") {
        this.width = width;
        this.height = height;
        this.id = id;
        this.enabledExtensions = new Map();
        this.divElement_ = null;
        this.canvasElement_ = null;
        this.aspectRatio = 1.0;
        this._visible = false;
        if (id && id.length > 0) {
            let e = document.getElementById(id);
            if (e) {
                this.divElement_ = e;
            }
            else {
                e = document.createElement("div");
                e.id = id;
                document.body.appendChild(e);
                this.divElement_ = e;
            }
        }
        if (!this.divElement_) {
            this.divElement_ = document.createElement("div");
            this.divElement_.id = "fluxions";
        }
        this.canvasElement_ = document.createElement("canvas");
        this.canvasElement_.width = width;
        this.canvasElement_.height = height;
        if (this.canvasElement_) {
            let gl = this.canvasElement_.getContext("webgl");
            if (!gl) {
                gl = this.canvasElement_.getContext("experimental-webgl");
            }
            if (!gl) {
                this.divElement_.innerText = "WebGL not supported.";
                throw "Unable to create rendering context!";
            }
            else {
                this.gl = gl;
                this.divElement_.appendChild(this.canvasElement_);
                this.divElement_.align = "center";
                this.aspectRatio = width / height;
                let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    hflog.log(vendor);
                    hflog.log(renderer);
                }
            }
        }
        else {
            throw "Unable to create canvas!";
        }
        // let self=this;
        // document.addEventListener("", (ev) {
        //     self._visible=true;
        // });
        // this.canvasElement_.addEventListener("de")
        this.EnableExtensions([
            "OES_standard_derivatives",
            "WEBGL_depth_texture",
            "OES_texture_float",
            "OES_element_index_uint",
            "EXT_texture_filter_anisotropic",
            "OES_texture_float",
            "OES_texture_float_linear"
        ]);
    }
    get visible() {
        return this._visible;
    }
    get canvas() {
        if (!this.canvasElement_)
            return new HTMLCanvasElement();
        return this.canvasElement_;
    }
    // ...
    EnableExtensions(names) {
        let supportedExtensions = this.gl.getSupportedExtensions();
        if (!supportedExtensions)
            return false;
        let allFound = true;
        for (let name of names) {
            let found = false;
            for (let ext of supportedExtensions) {
                if (name == ext) {
                    this.enabledExtensions.set(name, this.gl.getExtension(name));
                    hflog.log("Extension " + name + " enabled");
                    found = true;
                    break;
                }
            }
            if (!found) {
                hflog.log("Extension " + name + " not enabled");
                allFound = false;
                break;
            }
        }
        return allFound;
    }
    GetExtension(name) {
        if (this.enabledExtensions.has(name)) {
            return this.enabledExtensions.get(name);
        }
        return null;
    }
}
class TextParser {
    constructor(data) {
        this.lines = [];
        // split using regex any sequence of 1 or more newlines or carriage returns
        let lines = data.split(/[\n\r]+/);
        for (let line of lines) {
            let unfilteredTokens = line.split(/\s+/);
            if (unfilteredTokens.length > 0 && unfilteredTokens[0][0] == '#')
                continue;
            let tokens = [];
            for (let t of unfilteredTokens) {
                if (t.length > 0) {
                    tokens.push(t);
                }
            }
            if (tokens.length == 0) {
                continue;
            }
            this.lines.push(tokens);
        }
    }
    static MakeIdentifier(token) {
        if (token.length == 0)
            return "unknown";
        return token.replace(/[^\w]+/, "_");
    }
    static ParseIdentifier(tokens) {
        if (tokens.length >= 2)
            return tokens[1].replace(/[^\w]+/, "_");
        return "unknown";
    }
    static ParseVector(tokens) {
        let x = (tokens.length >= 2) ? parseFloat(tokens[1]) : 0.0;
        let y = (tokens.length >= 3) ? parseFloat(tokens[2]) : 0.0;
        let z = (tokens.length >= 4) ? parseFloat(tokens[3]) : 0.0;
        return new Vector3(x, y, z);
    }
    static ParseMatrix(tokens) {
        if (tokens.length > 16 && tokens[0] == "transform") {
            let m = new Matrix4(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), parseFloat(tokens[4]), parseFloat(tokens[5]), parseFloat(tokens[6]), parseFloat(tokens[7]), parseFloat(tokens[8]), parseFloat(tokens[9]), parseFloat(tokens[10]), parseFloat(tokens[11]), parseFloat(tokens[12]), parseFloat(tokens[13]), parseFloat(tokens[14]), parseFloat(tokens[15]), parseFloat(tokens[16])).asTranspose();
            return m;
        }
        return Matrix4.makeZero();
    }
    static ParseFaceIndices(_token) {
        // index 0 is position
        // index 1 is texcoord
        // index 2 is normal
        let indices = [-1, -1, -1];
        let token = _token.replace("//", "/0/");
        let tokens = token.split("/");
        if (tokens.length >= 1) {
            indices[0] = parseInt(tokens[0]) - 1;
        }
        if (tokens.length == 2) {
            indices[2] = parseInt(tokens[1]) - 1;
        }
        else if (tokens.length == 3) {
            indices[1] = parseInt(tokens[1]) - 1;
            indices[2] = parseInt(tokens[2]) - 1;
        }
        return indices;
    }
    static ParseFace(tokens) {
        let indices = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (tokens.length < 4) {
            return indices;
        }
        let v1 = TextParser.ParseFaceIndices(tokens[1]);
        let v2 = TextParser.ParseFaceIndices(tokens[2]);
        let v3 = TextParser.ParseFaceIndices(tokens[3]);
        return [...v1, ...v2, ...v3];
    }
}
class Hatchetfish {
    constructor(logElementId = "") {
        this._logElementId = "";
        this._logElement = null;
        this._numLines = 0;
        this.logElement = logElementId;
    }
    set logElement(id) {
        let el = document.getElementById(id);
        if (el instanceof HTMLDivElement) {
            this._logElement = el;
            this._logElementId = id;
        }
    }
    clear() {
        this._numLines = 0;
        if (this._logElement) {
            this._logElement.innerHTML = "";
        }
        let errorElement = document.getElementById("errors");
        if (errorElement) {
            errorElement.remove();
            //errorElement.innerHTML = "";
        }
    }
    writeToLog(prefix, message, ...optionalParams) {
        let text = prefix + ": " + message;
        for (let op of optionalParams) {
            if (op.toString) {
                text += " " + op.toString();
            }
            else {
                text += " <unknown>";
            }
        }
        if (this._logElement) {
            let newHTML = "<br/>" + text + this._logElement.innerHTML;
            this._logElement.innerHTML = newHTML;
            //this._logElement.appendChild(document.createElement("br"));
            //this._logElement.appendChild(document.createTextNode(text));
        }
    }
    log(message, ...optionalParams) {
        this.writeToLog("[LOG]", message, ...optionalParams);
        console.log(message, ...optionalParams);
    }
    info(message, ...optionalParams) {
        this.writeToLog("[INF]", message, ...optionalParams);
        console.info(message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.writeToLog("[ERR]", message, ...optionalParams);
        console.error(message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.writeToLog("[WRN]", message, ...optionalParams);
        console.warn(message, optionalParams);
    }
    debug(message, ...optionalParams) {
        console.log(message, ...optionalParams);
    }
}
var hflog = new Hatchetfish();
// Charles Emerson
// Started: 14 Nov 2018
// Updated: 14 Nov 2018
// 
// For CS480 Research Project
class DungeonCrawlerApp {
    constructor(width = 512, height = 384) {
        this.width = width;
        this.height = height;
        this.t0 = 0;
        this.t1 = 0;
        this.dt = 0;
        this.uiUpdateTime = 0;
        this.keysUpdateTime = 0;
        this.mouseClickPosition = new Vector2(-100, -100);
        this.shaderProgram = null;
        this.aVertexLocation = 0;
        this.aColorLocation = 0;
        this.aTextureCoordLocation = 0;
        this.uModelViewMatrixLocation = null;
        this.uProjectionMatrixLocation = null;
        this.uColor = null;
        this.uWorldMatrixLocation = null;
        this.uTextureMapLocation = null;
        this.uMapTexture = null;
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
        this.world = new MyWorld2D("./assets/crawler-tilemap-level0.txt", "./assets/crawler-entities-level0.txt", "./assets/crawler_spritesheet.png", 32, 32, this.renderingContext);
    }
    run() {
        this.init();
        this.mainloop(0);
    }
    init() {
        this.loadInput();
        this.loadShaders();
    }
    loadInput() {
        this.renderingContext.canvas.onclick = (e) => {
            // Global offset
            // hflog.log("Global: (" + (e.x) + ", " + e.y + ")");
            // // Canvas offset
            // hflog.log("Canvas: (" + (e.offsetX) + ", " + e.offsetY + ")");
            this.mouseClickPosition.x = e.offsetX;
            this.mouseClickPosition.y = e.offsetY;
            // let x = e.offsetX / this.renderingContext.canvas.width  *  2 - 1;
            // let y = e.offsetY / this.renderingContext.canvas.height * -2 + 1;
            // hflog.log("webgl: (" + x + ", " + y + ")");
        };
    }
    loadShaders() {
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
    loadShader(type, source) {
        let gl = this.renderingContext.gl;
        const shader = gl.createShader(type);
        if (!shader)
            return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            hflog.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    mainloop(timestamp) {
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
        window.requestAnimationFrame((t) => {
            self.update();
            self.display();
            self.mainloop(t);
        });
    }
    updateUI() {
        // Nothing here currently...
    }
    nextLevel() {
        // this.world.load("./assets/crawler-tilemap-level1.txt", "./assets/crawler-entities-level1.txt");
        this.world = new MyWorld2D("./assets/crawler-tilemap-level1.txt", "./assets/crawler-entities-level1.txt", "./assets/crawler_spritesheet.png", 32, 32, this.renderingContext);
    }
    update() {
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
    display() {
        let gl = this.renderingContext.gl;
        let sine = Math.abs(Math.sin(this.t1));
        gl.clearColor(sine * 0.1, sine * 0.1, sine * 0.3, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        let p = Matrix4.makeRowMajor(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
        let c = Matrix4.makeIdentity();
        gl.useProgram(this.shaderProgram);
        if (this.uProjectionMatrixLocation)
            gl.uniformMatrix4fv(this.uProjectionMatrixLocation, false, p.toColMajorArray());
        if (this.uModelViewMatrixLocation)
            gl.uniformMatrix4fv(this.uModelViewMatrixLocation, false, c.toColMajorArray());
        if (!this.world.checkDraw())
            return;
        let x_scale = this.world.tileMap.wWidth / this.world.tileMap.vWidth;
        let y_scale = this.world.tileMap.wHeight / this.world.tileMap.vHeight;
        let e = this.world.entities[this.world.getEntityIndexByName("player")];
        if (!e)
            return;
        let x = e.position.x;
        let y = e.position.y;
        let W = this.world.tileMap.wWidth;
        let H = this.world.tileMap.wHeight;
        let vW = this.world.tileMap.vWidth;
        let vH = this.world.tileMap.vHeight;
        let w = Matrix4.makeScale(x_scale, y_scale, 0.0); // .makeTranslation(0, 0.75, 0); // makeScale(x_scale, y_scale, 0.0);
        // w.Scale(x_scale, y_scale, 0.0);
        let y_translate = ((2 * y - vH) * y_scale) / H - (y_scale - 1);
        if (y_translate > y_scale - 1) {
            y_translate = y_scale - 1;
        }
        else if (y_translate < -(y_scale - 1)) {
            y_translate = -(y_scale - 1);
        }
        let x_translate = (x_scale - 1) - ((2 * x - vW) * x_scale) / W;
        if (x_translate > x_scale - 1) {
            x_translate = x_scale - 1;
        }
        else if (x_translate < -(x_scale - 1)) {
            x_translate = -(x_scale - 1);
        }
        w.Translate(x_translate, y_translate, 0);
        if (this.uWorldMatrixLocation) {
            gl.uniformMatrix4fv(this.uWorldMatrixLocation, false, w.toColMajorArray());
        }
        this.world.draw(gl, this.aVertexLocation, this.aColorLocation, this.aTextureCoordLocation);
        gl.useProgram(null);
    }
}
// Charles Emerson
// Started: Fall 2018
// Updated: 11 Nov 2018
// Basic Keyboard Input Listener
// Note abs(KEY_X) == abs(KEY_X_READ)
var KeyStatus;
(function (KeyStatus) {
    KeyStatus[KeyStatus["NONE"] = 0] = "NONE";
    KeyStatus[KeyStatus["KEY_DOWN_READ"] = -2] = "KEY_DOWN_READ";
    KeyStatus[KeyStatus["KEY_UP_READ"] = -1] = "KEY_UP_READ";
    KeyStatus[KeyStatus["KEY_UP"] = 1] = "KEY_UP";
    KeyStatus[KeyStatus["KEY_DOWN"] = 2] = "KEY_DOWN";
})(KeyStatus || (KeyStatus = {}));
class MyControls {
    constructor(keysToListenFor = []) {
        this.keysToListenFor = keysToListenFor;
        // Uses KeyboardEvent.code field to map a KeyStatus
        this.keysPressed = new Map();
        // Prevent default action of ctrl and/or alt modifiers
        this.prevent_ctrl = false;
        this.prevent_alt = false;
        let self = this;
        document.onkeydown = (e) => {
            // Only prevent default action of those we are listening for
            keysToListenFor.forEach((key) => {
                // Usually don't want to prevent ctrl and alt modified key events
                if (key == e.code && (!e.ctrlKey || this.prevent_ctrl) && (!e.altKey || this.prevent_alt)) {
                    e.preventDefault();
                }
            });
            if (!e.repeat) {
                self.keysPressed.set(e.code, KeyStatus.KEY_DOWN);
            }
        };
        document.onkeyup = (e) => {
            // Only prevent default action of those we are listening for
            keysToListenFor.forEach((key) => {
                if (key == e.code) {
                    e.preventDefault();
                }
            });
            let status = self.keysPressed.get(e.code);
            if (status != KeyStatus.KEY_UP_READ) {
                self.keysPressed.set(e.code, KeyStatus.KEY_UP);
            }
        };
    }
    checkAndUpdateListeners(names) {
        names.forEach((e) => {
            let doesntHaveName = true;
            for (let j = 0; j < this.keysToListenFor.length; ++j) {
                if (e == this.keysToListenFor[j]) {
                    doesntHaveName = false;
                    break;
                }
            }
            if (doesntHaveName) {
                this.keysToListenFor.push(e);
            }
        });
    }
    /** Couldn't come up with a good reason to use KeyStatus directly */
    // get(name: string): KeyStatus {
    //     this.checkAndUpdateListeners([name]);
    //     let temp = this.keysPressed.get(name);
    //     if (!temp) {
    //         return KeyStatus.NONE;
    //     }
    //     this.keysPressed.set(name, -Math.abs(temp));
    //     return temp;
    // }
    // getFrom(names: string[]): KeyStatus {
    //     this.checkAndUpdateListeners(names);
    //     let value: KeyStatus = KeyStatus.NONE;
    //     for(let i = 0; i < names.length; ++i) {
    //         let temp = this.keysPressed.get(names[i]);
    //         if (temp != undefined && temp != KeyStatus.NONE) {
    //             value = temp;
    //             this.keysPressed.set(names[i], -Math.abs(value));
    //         }
    //     }
    //     return value;
    // }
    isKeyClick(names) {
        let keyclick = false;
        names.forEach((e) => {
            let temp = this.keysPressed.get(e);
            if (temp && temp == KeyStatus.KEY_DOWN) {
                this.keysPressed.set(e, KeyStatus.KEY_DOWN_READ);
                keyclick = true;
            }
        });
        // You never start a program with a key down
        if (!keyclick)
            this.checkAndUpdateListeners(names);
        return keyclick;
    }
    isKeyDown(keys) {
        let keydown = false;
        keys.forEach((e) => {
            let temp = this.keysPressed.get(e);
            // For any of the that keys have KEY_DOWN set to KEY_DOWN_READ
            if (temp && Math.abs(temp) == KeyStatus.KEY_DOWN) {
                this.keysPressed.set(e, KeyStatus.KEY_DOWN_READ);
                keydown = true;
            }
        });
        // You never start a program with a key down
        if (!keydown)
            this.checkAndUpdateListeners(keys);
        return keydown;
    }
    isKeyUp(keys) {
        let keyup = false;
        keys.forEach((e) => {
            let temp = this.keysPressed.get(e);
            // For any of the that keys have KEY_UP set to KEY_UP_READ
            if (temp && Math.abs(temp) == KeyStatus.KEY_UP) {
                this.keysPressed.set(e, KeyStatus.KEY_UP_READ);
                keyup = true;
            }
        });
        // You never start a program with a key down
        if (!keyup)
            this.checkAndUpdateListeners(keys);
        return keyup;
    }
}
/// <reference path="../library/gte/GTE.ts"/>
class MyEntity {
    constructor() {
        this.transform = Matrix4.makeIdentity();
        this.position = new Vector2(0, 0);
        this.name = "unknown";
        this.sprites = [];
        this.alive = 0;
        // For movement
        this.alpha = -1;
        this.from = new Vector2();
        this.to = new Vector2();
        this.updir = 0;
    }
}
var MyImageRepeatMode;
(function (MyImageRepeatMode) {
    MyImageRepeatMode[MyImageRepeatMode["REPEAT"] = 10497] = "REPEAT";
    MyImageRepeatMode[MyImageRepeatMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    MyImageRepeatMode[MyImageRepeatMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(MyImageRepeatMode || (MyImageRepeatMode = {}));
var MyImageFilterMode;
(function (MyImageFilterMode) {
    MyImageFilterMode[MyImageFilterMode["NEAREST"] = 0] = "NEAREST";
    MyImageFilterMode[MyImageFilterMode["BILINEAR"] = 1] = "BILINEAR";
    MyImageFilterMode[MyImageFilterMode["TRILINEAR"] = 2] = "TRILINEAR";
    MyImageFilterMode[MyImageFilterMode["ANISOTROPIC"] = 3] = "ANISOTROPIC";
})(MyImageFilterMode || (MyImageFilterMode = {}));
class MyImage {
    constructor(width_, height_, makePowerOfTwo = false) {
        this.width_ = width_;
        this.height_ = height_;
        this.image = null;
        if (makePowerOfTwo) {
            this.width_ = 1 << ((0.5 + Math.log2(width_)) | 0);
            this.height_ = 1 << ((0.5 + Math.log2(height_)) | 0);
        }
        this.pixels = new Uint8ClampedArray(width_ * height_ * 4);
    }
    get loaded() { return (!this.image) ? false : this.image.complete; }
    get width() { return this.width_; }
    get height() { return this.height_; }
    isCoordsInside(x, y) {
        if (x >= 0 && x < this.width_ && y >= 0 && y < this.height_) {
            return true;
        }
        return false;
    }
    clearPixels(color) {
        let addr = 0;
        while (addr < this.pixels.length) {
            this.pixels[addr + 0] = color.x;
            this.pixels[addr + 1] = color.y;
            this.pixels[addr + 2] = color.z;
            this.pixels[addr + 3] = color.z;
            addr += 4;
        }
    }
    setPixel(x, y, color) {
        if (!this.isCoordsInside(x, y)) {
            return;
        }
        const addr = ((y | 0) * this.width_ + (x | 0)) << 2;
        this.pixels[addr + 0] = color.x;
        this.pixels[addr + 1] = color.y;
        this.pixels[addr + 2] = color.z;
        this.pixels[addr + 3] = color.z;
    }
    getPixel(x, y) {
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
    getAddr(x, y) {
        if (!this.isCoordsInside(x, y))
            return -1;
        return ((y | 0) * this.width_ + (x | 0)) << 2;
    }
    static blit(src, sx, sy, sw, sh, dst, dx, dy, dw, dh) {
        let deltaX = sw / dw;
        let deltaY = sh / dh;
        let srcy = sy;
        for (let y = dy; y < dy + dh; y++) {
            let srcx = sx;
            for (let x = dx; x < dx + dw; x++) {
                let daddr = dst.getAddr(x, y);
                if (daddr < 0)
                    continue;
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
    load(url, callbackfn) {
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
            }
            else {
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
    createTexture(gl, repeatMode = MyImageRepeatMode.CLAMP_TO_EDGE, filterMode = MyImageFilterMode.NEAREST) {
        let texture = gl.createTexture();
        if (!texture)
            return null;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        let imageData = new ImageData(this.pixels, this.width_, this.height_);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        if (filterMode == MyImageFilterMode.NEAREST) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
        else if (filterMode == MyImageFilterMode.BILINEAR) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
        else if (filterMode == MyImageFilterMode.TRILINEAR) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
        else if (filterMode == MyImageFilterMode.ANISOTROPIC) {
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
/// <reference path="../library/fluxions/Utils.ts" />
/// <reference path="MyImage.ts"/>
class MyImageArray {
    constructor(url, subImageWidth, subImageHeight) {
        this.url = url;
        this.subImageWidth = subImageWidth;
        this.subImageHeight = subImageHeight;
        this.name = "";
        this.subImages = [];
        this.textures = [];
        this.loaded_ = false;
        subImageWidth = subImageWidth | 0;
        subImageHeight = subImageHeight | 0;
        this.name = Utils.GetURLResource(url);
        this.image = new MyImage(0, 0, false);
        this.textures = [];
        let self = this;
        this.image.load(url, (image) => {
            const w = subImageWidth;
            const h = subImageHeight;
            let count = ((image.width / w) | 0) * ((image.height / h) | 0);
            self.subImages.length = count;
            let i = 0;
            for (let y = 0; y < image.height; y += h) {
                for (let x = 0; x < image.width; x += w) {
                    self.subImages[i] = new MyImage(w, h, false);
                    MyImage.blit(image, x, y, w, h, self.subImages[i], 0, 0, w, h);
                    i++;
                }
            }
            this.loaded_ = true;
        });
    }
    get loaded() { return this.loaded_; }
    get length() { return this.subImages.length; }
    createTextures(gl) {
        this.textures.length = this.subImages.length;
        let i = 0;
        for (let image of this.subImages) {
            this.textures[i] = image.createTexture(gl);
            i++;
        }
    }
    useTexture(gl, i, unit = 0) {
        if (this.textures.length == 0)
            this.createTextures(gl);
        i = i | 0;
        unit = unit | 0;
        if (this.textures[i]) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
        }
    }
}
// J. B. Metzgar
// Started: Fall 2018
// For CS480 Computer Graphics Fundamentals
class MyShapeOutline {
    constructor(type = 0, first = 0, count = 0) {
        this.type = type;
        this.first = first;
        this.count = count;
    }
}
class MyShape {
    constructor() {
        this.currentVertex = Vector3.make(0, 0, 0);
        this.currentColor = Vector3.make(1, 1, 1);
        this.currentTexCoord = Vector2.make(0, 0);
        this.currentNormal = Vector3.make(0, 0, 1);
        this.count = 0;
        this.vertices = [];
        this.surfaces = [];
        this.dirty = true;
        this.buffer = null;
        this.vOffset = 0;
        this.cOffset = 4 * 3;
        this.tOffset = 4 * 6;
        this.nOffset = 4 * 8;
        this.stride = 4 * 11;
    }
    vertex(x, y, z) {
        this.currentVertex.x = x;
        this.currentVertex.y = y;
        this.currentVertex.z = z;
        this.emitVertex();
    }
    vertex3(xyz) {
        this.currentVertex.x = xyz.x;
        this.currentVertex.y = xyz.y;
        this.currentVertex.z = xyz.z;
        this.emitVertex();
    }
    color(r, g, b) {
        this.currentColor.x = r;
        this.currentColor.y = g;
        this.currentColor.z = b;
    }
    color3(rgb) {
        this.currentColor.copy(rgb);
    }
    texCoord(s, t) {
        this.currentTexCoord.x = s;
        this.currentTexCoord.y = t;
    }
    texCoord2(st) {
        this.currentTexCoord.x = st.x;
        this.currentTexCoord.y = st.y;
    }
    normal(x, y, z) {
        this.currentNormal.reset(x, y, z);
    }
    normal3(xyz) {
        this.currentNormal.reset(xyz.x, xyz.y, xyz.z);
    }
    // add a new index to the surface
    // negative numbers backward index into the shape vertices
    addIndex(which) {
    }
    clear() {
        this.vertices = [];
        this.surfaces = [];
        this.dirty = true;
    }
    newSurface(type) {
        let surface = new MyShapeOutline(type, this.count, 0);
        this.surfaces.push(surface);
    }
    emitVertex() {
        if (this.surfaces.length == 0) {
            return;
        }
        let last = this.surfaces.length - 1;
        let v = [
            this.currentVertex.x,
            this.currentVertex.y,
            this.currentVertex.z,
            this.currentColor.x,
            this.currentColor.y,
            this.currentColor.z,
            this.currentTexCoord.x,
            this.currentTexCoord.y,
            this.currentNormal.x,
            this.currentNormal.y,
            this.currentNormal.z
        ];
        this.vertices.push(...v);
        this.count++;
        this.surfaces[last].count++;
        this.dirty = true;
    }
    buildBuffers(gl) {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        this.dirty = false;
    }
    draw(gl, vertexIndex = -1, colorIndex = -1, texCoordIndex = -1, normalIndex = -1) {
        if (this.dirty)
            this.buildBuffers(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        if (vertexIndex >= 0) {
            gl.enableVertexAttribArray(vertexIndex);
            gl.vertexAttribPointer(vertexIndex, 3, gl.FLOAT, false, this.stride, this.vOffset);
        }
        if (colorIndex >= 0) {
            gl.enableVertexAttribArray(colorIndex);
            gl.vertexAttribPointer(colorIndex, 3, gl.FLOAT, false, this.stride, this.cOffset);
        }
        if (texCoordIndex >= 0) {
            gl.enableVertexAttribArray(texCoordIndex);
            gl.vertexAttribPointer(texCoordIndex, 2, gl.FLOAT, false, this.stride, this.tOffset);
        }
        if (normalIndex >= 0) {
            gl.enableVertexAttribArray(normalIndex);
            gl.vertexAttribPointer(colorIndex, 3, gl.FLOAT, false, this.stride, this.nOffset);
        }
        for (let surface of this.surfaces) {
            gl.drawArrays(surface.type, surface.first, surface.count);
        }
    }
}
/// <reference path="../library/gte/GTE.ts" />
/// <reference path="../library/fluxions/Utils.ts" />
/// <reference path="MyImageArray.ts" />
class MyTileMap {
    constructor() {
        this.vWidth = 0;
        this.vHeight = 0;
        this.wWidth = 0;
        this.wHeight = 0;
        this.tileData = [];
    }
    parseInputFile(data) {
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
            }
            else {
                for (let i = 0; i < tokens.length; i++) {
                    let tileId = parseInt(tokens[i]);
                    this.setTile(i, count - 1, tileId);
                }
            }
            ++count;
        }
    }
    resize(numCols, numRows) {
        this.wWidth = numCols;
        this.wHeight = numRows;
        this.tileData = [];
        this.tileData.length = numCols * numRows;
        for (let i = 0; i < this.tileData.length; i++) {
            this.tileData[i] = -1;
        }
    }
    setTile(col, row, tileId) {
        if (col < 0 || row < 0 || col >= this.wWidth || row >= this.wHeight)
            return;
        const addr = row * this.wWidth + col;
        this.tileData[addr] = tileId;
    }
    getTile(col, row) {
        if (col < 0 || row < 0 || col >= this.wWidth || row >= this.wHeight)
            return -1;
        const addr = row * this.wWidth + col;
        return this.tileData[addr];
    }
}
/// <reference path="../library/fluxions/Utils.ts" />
/// <reference path="../library/fluxions/TextParser.ts" />
/// <reference path="../library/gte/GTE.ts" />
/// <reference path="MyEntity.ts" />
/// <reference path="MyTileMap.ts" />
class MyWorld2D {
    constructor(tileMapUrl, entityUrl, celSheetUrl, celWidth, celHeight, renderingContext) {
        this.tileMapUrl = tileMapUrl;
        this.entityUrl = entityUrl;
        this.entities = [];
        this.effects = [];
        this.tileMap = new MyTileMap();
        this.backgroundTileId = -1;
        this.backgroundScaleX = 1;
        this.backgroundScaleY = 1;
        this.tmap_surface = new MyShape();
        this.loaded = false;
        this.entitiesLoaded = false;
        this.tilemapLoaded = false;
        this.dirty = false;
        this.colorIndex = 0;
        this.texCoordIndex = 0;
        let self = this;
        this.canvasWidth = renderingContext.width;
        this.canvasHeight = renderingContext.height;
        new Utils.TextFileLoader(tileMapUrl, (data, name, parameter) => {
            self.parseTileMap(data);
        });
        new Utils.TextFileLoader(entityUrl, (data, name, parameter) => {
            self.parseEntities(data);
        });
        this.celSheet = new MyImageArray(celSheetUrl, celWidth, celHeight);
    }
    parseTileMap(data) {
        this.dirty = true;
        this.tileMap.parseInputFile(data);
        this.tilemapLoaded = true;
    }
    parseEntities(data) {
        let tp = new TextParser(data);
        let entityIndex = this.entities.length - 1;
        for (let tokens of tp.lines) {
            if (tokens[0] == "entity" && tokens.length >= 2) {
                this.entities.push(new MyEntity());
                entityIndex = this.entities.length - 1;
                this.entities[entityIndex].name = tokens[1];
            }
            // set properties of most recent entity
            if (entityIndex < 0)
                continue;
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
    getEntityIndexByName(name) {
        for (let index = 0; index < this.entities.length; ++index) {
            if (this.entities[index].name == name)
                return index;
        }
        return -1;
    }
    setEntityPosition(which, x, y) {
        const tilemap_width = this.tileMap.wWidth;
        const tilemap_height = this.tileMap.wHeight;
        let x_distance = this.canvasWidth / tilemap_width;
        let y_distance = this.canvasHeight / tilemap_height;
        let x_diff = x - this.entities[which].position.x;
        let y_diff = y - this.entities[which].position.y;
        this.entities[0].transform.Translate(x_diff * x_distance, y_diff * y_distance, 0);
        this.entities[which].position.x = x;
        this.entities[which].position.y = y;
    }
    setBackground(backgroundTileId, backgroundScaleX, backgroundScaleY) {
        this.backgroundTileId = backgroundTileId;
        this.backgroundScaleX = backgroundScaleX;
        this.backgroundScaleY = backgroundScaleY;
    }
    moveEntityPosition(which, x, y) {
        const tilemap_width = this.tileMap.wWidth;
        const tilemap_height = this.tileMap.wHeight;
        let x_distance = this.canvasWidth / tilemap_width;
        let y_distance = this.canvasHeight / tilemap_height;
        this.entities[0].transform.Translate(x * x_distance, y * y_distance, 0);
        this.entities[which].position.x += x;
        this.entities[which].position.y += y;
    }
    load(tileMapUrl, entityUrl) {
        this.tileMapUrl = tileMapUrl;
        this.entityUrl = entityUrl;
        this.reload();
    }
    reload() {
        let self = this;
        this.entities.splice(0);
        new Utils.TextFileLoader(this.tileMapUrl, (data, name, parameter) => {
            self.parseTileMap(data);
        });
        new Utils.TextFileLoader(this.entityUrl, (data, name, parameter) => {
            self.parseEntities(data);
        });
    }
    renderCel(gl, which, x, y, w, h) {
        this.celSheet.useTexture(gl, which, 0);
        let shape = new MyShape();
        shape.newSurface(gl.TRIANGLE_STRIP);
        let v0 = Vector2.make(x, y); // lower left
        let v1 = Vector2.make(x + w, y + h); // upper right
        let st0 = Vector2.make(0.0, 0.0); // lower left
        let st1 = Vector2.make(1.0, 1.0); // upper right
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
        const sS_w = this.celSheet.image.width / sI_w;
        const sS_h = this.celSheet.image.height / sI_h;
        const visibleW = this.tileMap.vWidth;
        const visibleH = this.tileMap.vHeight;
        const worldW = this.tileMap.wWidth;
        const worldH = this.tileMap.wHeight;
        const w_lim = sI_w * worldW / 2;
        const h_lim = sI_h * worldH / 2;
        const TRIANGLE_FAN = WebGLRenderingContext.TRIANGLE_FAN;
        this.tmap_surface.clear();
        for (let i = 0; i < worldW; ++i) {
            for (let j = 0; j < worldH; ++j) {
                let id = this.tileMap.getTile(i, j);
                if (id < 0)
                    continue;
                let x = i * sI_w;
                let y = j * sI_h;
                let x_left = 2 * i / worldW - 1.0, x_right = 2 * (i + 1) / worldW - 1.0;
                let y_top = 1.0 - 2 * j / worldH, y_bottom = 1.0 - 2 * (j + 1) / worldH;
                let s = id % sS_w, t = Math.floor(id / sS_w);
                let s_left = s / sS_w, s_right = (s + 0.99) / sS_w;
                let t_top = (t) / sS_h, t_bottom = (t + 0.99) / sS_h;
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
    addTile(shape, x, y, id) {
        const sI_w = this.celSheet.subImageWidth;
        const sI_h = this.celSheet.subImageHeight;
        const sS_w = this.celSheet.image.width / sI_w;
        const sS_h = this.celSheet.image.height / sI_h;
        const visibleW = this.tileMap.vWidth;
        const visibleH = this.tileMap.vHeight;
        const worldW = this.tileMap.wWidth;
        const worldH = this.tileMap.wHeight;
        const TRIANGLE_FAN = WebGLRenderingContext.TRIANGLE_FAN;
        let x_left = 2 * x / worldW - 1.0, x_right = 2 * (x + 1) / worldW - 1.0;
        let y_top = 1.0 - 2 * y / worldH, y_bottom = 1.0 - 2 * (y + 1) / worldH;
        let s = id % sS_w, t = Math.floor(id / sS_w);
        let s_left = s / sS_w, s_right = (s + 0.99) / sS_w;
        let t_top = (t) / sS_h, t_bottom = (t + 0.99) / sS_h;
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
    isWalkable(pos, updir) {
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
        if ((this.tileMap.getTile(pos.x, pos.y) >= 0 && this.tileMap.getTile(pos.x, pos.y) < 16)
            || this.tileMap.getTile(pos.x, pos.y) == 32) {
            return false;
        }
        return true;
    }
    isExit(pos) {
        return (this.tileMap.getTile(pos.x, pos.y) == 28);
    }
    addEffect(sprites, position, updir, alive) {
        let e = new MyEntity();
        e.alive = alive;
        e.position = position;
        e.updir = updir;
        e.sprites = sprites;
        this.effects.push(e);
    }
    checkDraw() {
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
    draw(gl, vertexIndex, colorIndex, texCoordIndex) {
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
        }
        else if (this.dirty) {
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
            if (e.alive < 0 || e.updir < 0 || e.sprites.length < 1)
                continue;
            this.addTile(surface, e.position.x, e.position.y, e.sprites[e.updir]);
        }
        for (let i = 0; i < this.effects.length; ++i) {
            let e = this.effects[i];
            if (e.alive < 0 || e.updir < 0 || e.sprites.length < 1)
                continue;
            this.addTile(surface, e.position.x, e.position.y, e.sprites[e.updir]);
            --this.effects[i].alive;
            if (this.effects[i].alive < 0)
                this.effects.slice(i, 1);
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
// Charles Emerson
// Started: 16 Nov 2018
// Updated: 16 Nov 2018
///<reference path="../library/gte/Vector3.ts"/>
function getRandomBrightColor() {
    let r = Math.random() * 0.25 + 0.25;
    let g = Math.random() * 0.25 + 0.25;
    let b = Math.random() * 0.25 + 0.25;
    let x = Math.random();
    if (Math.random() < 0.5) {
        if (x < 1 / 3) {
            r = 0.2 * Math.random() + 0.8;
        }
        else if (x < 2 / 3) {
            g = 0.2 * Math.random() + 0.8;
        }
        else {
            b = 0.2 * Math.random() + 0.8;
        }
    }
    else {
        if (x < 1 / 3) {
            r = 0.2 * Math.random() + 0.8;
            g = 0.2 * Math.random() + 0.8;
        }
        else if (x < 2 / 3) {
            r = 0.2 * Math.random() + 0.8;
            b = 0.2 * Math.random() + 0.8;
        }
        else {
            g = 0.2 * Math.random() + 0.8;
            b = 0.2 * Math.random() + 0.8;
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
        }
        else {
            b = Math.random() * 0.5;
        }
    }
    else if (r < 0.6) {
        if (b < 0.5) {
            g = Math.random() * 0.3 + 0.4;
        }
        else {
            g = Math.random() * 0.5;
        }
    }
    else {
        if (b < 0.5) {
            g = Math.random() * 0.3 + 0.4;
        }
        else {
            g = Math.random() * 0.5;
        }
    }
    return new Vector3(r, g, b);
}
function getRandomColor() {
    return new Vector3(Math.random(), Math.random(), Math.random());
}
//# sourceMappingURL=library.js.map