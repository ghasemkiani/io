//	@ghasemkiani/base/io/futil

const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const {Obj: Base} = require("@ghasemkiani/base/obj");

class FUtil extends Base {
	async toCopyDir(dir1, dir2) {
		if(fs.existsSync(dir1)) {
			await fsPromises.mkdir(dir2, {recursive: true});
			let ff = await fsPromises.readdir(dir1, {withFileTypes: true});
			for(let f of ff) {
				let p1 = path.join(dir1, f.name);
				let p2 = path.join(dir2, f.name);
				if(f.isFile()) {
					await fsPromises.copyFile(p1, p2);
				} else if(f.isDirectory()) {
					await this.toCopyDir(p1, p2);
				}
			}
		}
	}
	async toDelDir(dir) {
		if(fs.existsSync(dir)) {
			let ff = fs.readdirSync(dir, {withFileTypes: true});
			for(let f of ff) {
				let p = path.join(dir, f.name);
				if(f.isFile() || f.isSymbolicLink()) {
					fs.unlinkSync(p);
				} else if(f.isDirectory()) {
					await this.toDelDir(p);
				} else {
					// ?
				}
			}
			fs.rmdirSync(dir);
		}
	}
}

let futil = new FUtil();

module.exports = {
	FUtil,
	futil,
};
