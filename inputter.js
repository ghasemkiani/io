//	@ghasemkiani/io/inputter

import readline from "readline";

import {Obj} from "@ghasemkiani/base";

class Inputter extends Obj {
	// _rl

	get rl() {
		if (!this._rl) {
			this._rl = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				});
		}
		return this._rl;
	}
	set rl(rl) {
		this._rl = rl;
	}
	close() {
		if (this._rl) {
			this._rl.close();
		}
	}
	async toReadLine(prompt) {
		return new Promise((resolve, reject) => {
			try {
				if (typeof prompt === "undefined" || prompt === null) {
					prompt = "";
				} else if (typeof prompt !== "string") {
					prompt = String(prompt);
				}
				this.rl.question(prompt, answer => {
					resolve(answer);
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	async toReadLineTimeout(ms, prompt, defaultAnswer = null) {
		return new Promise((resolve, reject) => {
			try {
				let rl = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				});
				let handle = setTimeout(() => {
					rl.close();
					resolve(defaultAnswer);
				}, ms);
				rl.question(cutil.asString(prompt), answer => {
					clearTimeout(handle);
					rl.close();
					resolve(answer);
				});
			} catch(e) {
				reject(e);
			}
		});
	}
	static async toInput(prompt) {
		let inputter = new Inputter();
		let line = await inputter.toReadLine(prompt + " ");
		inputter.close();
		return line;
	}
	static async toConfirm(prompt) {
		let line = await this.toInput(prompt);
		return /^\s*y/i.test(line);
	}
	static async toConfirmOrThrow(prompt, message) {
		if (!(await this.toConfirm(prompt))) {
			throw new Error(message);
		}
	}
}

export {Inputter};
