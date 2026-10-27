/* @ts-self-types="./once_keys.d.ts" */
import * as wasm from "./once_keys_bg.wasm";
import { __wbg_set_wasm } from "./once_keys_bg.js";

__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    derive_door_json
} from "./once_keys_bg.js";
