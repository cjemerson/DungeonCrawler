// Charles Emerson
// Started: Fall 2018
// Updated: 11 Nov 2018
// Basic Keyboard Input Listener

// Note abs(KEY_X) == abs(KEY_X_READ)
enum KeyStatus {
    NONE = 0,
    KEY_DOWN_READ = -2,
    KEY_UP_READ = -1,
    KEY_UP = 1,
    KEY_DOWN = 2,
}

class MyControls {
    // Uses KeyboardEvent.code field to map a KeyStatus
    keysPressed: Map<string, number> = new Map<string, number>();

    // Prevent default action of ctrl and/or alt modifiers
    public prevent_ctrl : boolean = false;
    public prevent_alt : boolean = false;

    constructor(private keysToListenFor: string [] = []) {
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

    checkAndUpdateListeners(names: string[]) {
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

    isKeyClick(names: string[]) {
        let keyclick = false;

        names.forEach((e) => {
            let temp = this.keysPressed.get(e);
            if (temp && temp == KeyStatus.KEY_DOWN) {
                this.keysPressed.set(e, KeyStatus.KEY_DOWN_READ);
                keyclick = true;
            }
        });

        // You never start a program with a key down
        if (!keyclick) this.checkAndUpdateListeners(names);
        return keyclick;
    }

    isKeyDown(keys: string[]) : boolean {
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
        if (!keydown) this.checkAndUpdateListeners(keys);
        return keydown;
    }

    isKeyUp(keys: string[]) : boolean {
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
        if (!keyup) this.checkAndUpdateListeners(keys);
        return keyup;
    }
}