import path from "node:path";
import fs from "node:fs";

import { Obj } from "@ghasemkiani/base";

class FUtil extends Obj {
  async toCopyDir(dir1, dir2) {
    if (fs.existsSync(dir1)) {
      await fs.promises.mkdir(dir2, { recursive: true });
      let ff = await fs.promises.readdir(dir1, { withFileTypes: true });
      for (let f of ff) {
        let p1 = path.join(dir1, f.name);
        let p2 = path.join(dir2, f.name);
        if (f.isFile()) {
          await fs.promises.copyFile(p1, p2);
        } else if (f.isDirectory()) {
          await this.toCopyDir(p1, p2);
        }
      }
    }
  }
  async toDelDir(dir) {
    if (fs.existsSync(dir)) {
      let ff = fs.readdirSync(dir, { withFileTypes: true });
      for (let f of ff) {
        let p = path.join(dir, f.name);
        if (f.isFile() || f.isSymbolicLink()) {
          fs.unlinkSync(p);
        } else if (f.isDirectory()) {
          await this.toDelDir(p);
        } else {
          // ?
        }
      }
      fs.rmdirSync(dir);
    }
  }
  renameWithoutChangingLastModifiedDate(path1, path2) {
    let { atime, mtime } = fs.statSync(path1, {});
    atime = new Date();
    fs.renameSync(path1, path2);
    fs.utimesSync(path2, atime, mtime);
  }
}

let futil = new FUtil();

export { FUtil, futil };
