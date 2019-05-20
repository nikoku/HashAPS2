import * as React from "react";
import { render } from "react-dom";
import AmmoData from "./ammoList";
import { sentence } from "./sentence";
import Hash from "./hash";

import "./styles.css";

const logE092 = Math.log(0.92);

interface LoaderCalculateProp {
  diameter: number;
  length: number;
  gunpowder: number;
}
interface LoaderCalculateState {
  barrelNum: number;
  loaderSize: string;
  loaderNum: number;
  clipNum: number;
}
class LoaderCalculate extends React.Component<
  LoaderCalculateProp,
  LoaderCalculateState
> {
  readonly hash = new Hash();
  constructor(props: LoaderCalculateProp) {
    super(props);
    this.state = {
      barrelNum: this.hash.barrelNum,
      loaderSize: this.hash.loaderSize,
      loaderNum: this.hash.loaderNum,
      clipNum: this.hash.clipNum
    };
  }
  private get maxNumberOfBarrel() {
    const diameter = this.props.diameter;
    if (diameter <= 150) return 6;
    else if (diameter <= 175) return 5;
    else if (diameter <= 200) return 4;
    else if (diameter <= 225) return 3;
    else if (diameter <= 250) return 2;
    else return 1;
  }
  private get minLoaderSize() {
    const length = this.props.length;
    const requireSize = Math.ceil(length / 1000);
    return requireSize;
  }

  private get ammoVolume() {
    const diameterM = this.props.diameter / 1000;
    const ammoVolume = (this.props.length * (Math.PI * diameterM ** 2)) / 4000;
    return ammoVolume;
  }
  private get reloadTime() {
    const clipNum = this.state.clipNum;
    const loaderNumBonus = 1.0002 * parseInt(this.state.loaderSize) ** -0.501;
    const loaderNumPenalty = this.state.loaderNum ** 0.25;
    const clipNumBonus = clipNum === 0 ? 1 : clipNum ** 0.5;
    const clipLessPenalty = clipNum === 0 ? 1.5 : 1;
    const reloadModifier =
      ((loaderNumBonus * loaderNumPenalty) / clipNumBonus) * clipLessPenalty;
    const expectedReloadTime = 50 * this.ammoVolume ** 0.5;
    const reloadTime = expectedReloadTime * reloadModifier;
    return reloadTime;
  }
  private get coolTime() {
    return (this.reloadTime * this.state.barrelNum) / this.state.loaderNum;
  }
  private get fireRate() {
    return (60 * this.state.barrelNum) / this.coolTime;
  }
  private get requiredFeeder() {
    const supply2clip = 100 * this.ammoVolume ** 0.5;
    return supply2clip / this.reloadTime;
  }
  private get requiredCooling() {
    const diameterM = this.props.diameter / 1000;
    const result =
      Math.log(
        this.coolTime /
          (3 * 0.9 * (diameterM / 0.2) ** 1.5 * this.props.gunpowder ** 0.5)
      ) / logE092;
    return result > 0 ? result : 0;
  }

  input() {
    return (
      <>
        <label style={{ gridRow: "1" }}>
          {sentence["barrel count"]}：
          <select
            style={{
              color:
                this.maxNumberOfBarrel < this.state.barrelNum
                  ? "red"
                  : undefined
            }}
            defaultValue={this.state.barrelNum.toString()}
            onChange={event => {
              this.setState({ barrelNum: parseInt(event.target.value) });
              this.hash.barrelNum = parseInt(event.target.value);
            }}
          >
            {[...Array(6).keys()].map(e => (
              <option key={e} disabled={e + 1 > this.maxNumberOfBarrel}>
                {e + 1}
              </option>
            ))}
          </select>
        </label>
        <label style={{ gridRow: "3" }}>
          {sentence["loader size"]}：
          <select
            style={{
              color:
                parseInt(this.hash.loaderSize) < this.minLoaderSize
                  ? "red"
                  : undefined
            }}
            defaultValue={this.state.loaderSize.toString()}
            onChange={event => {
              this.setState({ loaderSize: event.target.value });
              this.hash.loaderSize = event.target.value;
            }}
          >
            {["1(Belt)", "1", "2", "3", "4", "6", "8"].map(e => (
              <option key={e} disabled={this.minLoaderSize > parseInt(e)}>
                {e}
              </option>
            ))}
          </select>
          [m]
        </label>
        <label style={{ gridRow: "4" }}>
          {sentence["number of autoloaders"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            max={1000}
            min={1}
            value={this.state.loaderNum.toString()}
            onChange={event => {
              const value = parseInt(event.target.value);
              const num = value > 0 ? value : 1;
              this.setState({ loaderNum: num });
              this.hash.loaderNum = num;
            }}
          />
        </label>
        <label style={{ gridRow: "5" }}>
          {sentence["number of clips"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            max={6}
            min={0}
            defaultValue={this.state.clipNum.toString()}
            onChange={event => {
              this.setState({ clipNum: parseInt(event.target.value) });
              this.hash.clipNum = parseInt(event.target.value);
            }}
          />
        </label>
      </>
    );
  }
  output() {
    return (
      <>
        <label style={{ gridRow: "1" }}>
          {sentence["reload time"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            disabled
            readOnly
            value={this.reloadTime.toFixed(2)}
            max={1000}
            min={0}
            step={0.01}
          />
          [s]
        </label>
        <label style={{ gridRow: "2" }}>
          {sentence["cool time"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            disabled
            readOnly
            value={this.coolTime.toFixed(2)}
            max={1000}
            min={-999}
            step={0.01}
          />
          [s]
        </label>
        <label style={{ gridRow: "3" }}>
          {sentence["fire rate"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            disabled
            readOnly
            value={this.fireRate.toFixed(2)}
            max={2400}
            min={0}
            step={0.01}
          />
          [/min]
        </label>
        <label style={{ gridRow: "4" }}>
          {sentence["feeder require"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            disabled
            readOnly
            value={this.requiredFeeder.toFixed(2)}
            max={12}
            min={0}
            step={0.01}
          />
        </label>
        <label style={{ gridRow: "5" }}>
          {sentence["cooling require"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            disabled
            readOnly
            value={this.requiredCooling.toFixed(2)}
            max={1000}
            min={0}
            step={0.01}
          />
        </label>
      </>
    );
  }
  render() {
    return (
      <div
        style={{
          width: "max-content",
          height: "max-content",
          display: "grid",
          gridTemplateRows: "1fr 0.2fr 1fr",
          justifyItems: "end"
        }}
      >
        <article
          style={{
            gridRow: "1",
            width: "max-content",
            textAlign: "right",
            display: "grid",
            gridTemplateRows: "1fr 0.5fr 1fr 1fr"
          }}
        >
          {this.input()}
        </article>
        <article
          style={{
            gridRow: "3",
            width: "max-content",
            textAlign: "right",
            display: "grid",
            gridTemplateRows: "1fr 0.5fr 1fr 1fr"
          }}
        >
          {this.output()}
        </article>
      </div>
    );
  }
}

export default LoaderCalculate;
