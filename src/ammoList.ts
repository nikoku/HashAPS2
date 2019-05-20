class AmmoData {
  readonly id: string = "";
  readonly name: string = "";
  private readonly speed: number = 0;
  readonly ap: number = 0;
  readonly kd: number = 0;
  readonly detect: number = 0;
  readonly health: number = 0;
  readonly maxLength: number = 0;
  constructor(init: Partial<AmmoData>) {
    Object.assign(this, init);
  }
  speedCofficient(index: number) {
    return this.speed * 0.75 ** index;
  }
  static fetch(onFinish: (param: any) => void) {
    const apiUrl =
      "https://script.google.com/macros/s/AKfycbyu9VW7EPHyQlzcOL0V5LyKhiKQpIJms_yXy_YvQ7yJUNqFD6c8/exec";
    fetch(apiUrl, { mode: "cors" })
      .then(response => response.json())
      .then(json => json.map((obj: any) => new AmmoData(obj)))
      .then((json: AmmoData[]) => {
        onFinish(json);
      })
      .catch(err => console.log(err));
  }
}

export default AmmoData;
