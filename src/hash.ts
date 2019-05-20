const hash62 = [...Array(10).keys()]
  .map(i => i.toString())
  .concat(
    [...Array(26).keys()].map(i => String.fromCharCode("a".charCodeAt(0) + i)),
    [...Array(26).keys()].map(i => String.fromCharCode("A".charCodeAt(0) + i))
  );
const decodeHash62 = [...hash62.entries()].reduce((accum: any, current) => {
  accum[current[1]] = current[0];
  return accum;
}, {});

function decodeHash(code: string) {
  const codeArray = code.split("");
  const result = codeArray
    .reverse()
    .reduce((sum, current, i) => sum + decodeHash62[current] * 10 ** i, 0);
  return result;
}

class Hash {
  readonly defaultHash = "18.0a00";
  readonly ammoReg = String.raw`#([0-9]+(\.[0-9]+)?)([a-zA-Z][a-zA-Z0-9]*)([a-zA-Z0-9])([a-zA-Z0-9])`;
  readonly loaderReg = String.raw`([1-6])([123468B])([0-9a-zA-Z]{2})([0-9a-c])`;
  readonly hashReg = new RegExp(`^${this.ammoReg}${this.loaderReg}$`);
  get hash() {
    const defaultData = ["", "18", "", "a", "0", "0", "1", "1", "1", "0"];
    const data =
      this.hashReg.exec(window.location.hash) ||
      new RegExp(this.ammoReg).exec(window.location.hash) ||
      defaultData;
    return {
      diameter: parseFloat(data[1]),
      ammoList: data[3],
      gunpowder: parseInt(decodeHash62[data[4]]),
      railgun: parseInt(decodeHash62[data[5]]),
      barrelNum: parseInt(data[6] || "1"),
      loaderSize: data[7] || "1",
      loaderNum: decodeHash(data[8] || "00"),
      clipNum: parseInt(data[9] || "0"),
      get hash() {
        const loaderNum = `${hash62[Math.floor(this.loaderNum / 62)]}${
          hash62[this.loaderNum % 62]
        }`;
        return `#${this.diameter}${this.ammoList}${hash62[this.gunpowder]}${
          hash62[this.railgun]
        }${this.barrelNum}${this.loaderSize}${loaderNum}${this.clipNum}`;
      }
    };
  }
  get ammoList(): string[] {
    const { ammoList } = this.hash;
    return ammoList.split("");
  }
  set ammoList(ammoList: string[]) {
    const hash = this.hash;
    hash.ammoList = ammoList.join("");
    window.location.hash = hash.hash;
  }

  get diameter(): number {
    const { diameter } = this.hash;
    return diameter;
  }
  set diameter(diameter: number) {
    const hash = this.hash;
    hash.diameter = diameter;
    window.location.hash = hash.hash;
  }

  get gunpowder(): number {
    const { gunpowder } = this.hash;
    return gunpowder;
  }
  set gunpowder(gunpowder: number) {
    const hash = this.hash;
    hash.gunpowder = gunpowder;
    window.location.hash = hash.hash;
  }

  get railgun(): number {
    const { railgun } = this.hash;
    return railgun;
  }
  set railgun(railgun: number) {
    const hash = this.hash;
    hash.railgun = railgun;
    window.location.hash = hash.hash;
  }

  get barrelNum(): number {
    const { barrelNum } = this.hash;
    return barrelNum;
  }
  set barrelNum(barrelNum: number) {
    const hash = this.hash;
    hash.barrelNum = barrelNum;
    window.location.hash = hash.hash;
  }

  get loaderSize(): string {
    const { loaderSize } = this.hash;
    return loaderSize === "B" ? "1(Belt)" : loaderSize;
  }
  set loaderSize(loaderSize: string) {
    const hash = this.hash;
    hash.loaderSize = loaderSize === "1(Belt)" ? "B" : loaderSize;
    window.location.hash = hash.hash;
  }

  get loaderNum(): number {
    const { loaderNum } = this.hash;
    return loaderNum;
  }
  set loaderNum(loaderNum: number) {
    const hash = this.hash;
    hash.loaderNum = loaderNum;
    window.location.hash = hash.hash;
  }

  get clipNum(): number {
    const { clipNum } = this.hash;
    return clipNum;
  }
  set clipNum(clipNum: number) {
    const hash = this.hash;
    hash.clipNum = clipNum;
    window.location.hash = hash.hash;
  }
}

export default Hash;
