import * as React from "react";
import { render } from "react-dom";
import AmmoData from "./ammoList";
import { sentence } from "./sentence";

interface CaluculateSpeedProp {
  diameter: number;
  gunpowder: number;
  railgun: number;
  ammoSelectorId: string[];
  ammoDataList: AmmoData[];
}
class CaluculateSpeed extends React.Component<CaluculateSpeedProp> {
  render() {
    const ammoList = this.props.ammoSelectorId
      .map(id => this.props.ammoDataList.find(e => e.id === id)!)
      .map(ammoData => {
        return ammoData;
      });
    const warheadLength = ammoList.reduce(
      (accum, current) =>
        accum + Math.min(current.maxLength, this.props.diameter),
      0
    );
    const warheadNum = warheadLength / this.props.diameter;
    const warheadVolume = this.calcVolume(
      warheadLength / 1000,
      this.props.diameter
    );
    const speedCoefficient = this.calcSpeedCoefficient(ammoList);
    const gunpowderSpeed = this.calcGunpowder(
      warheadNum,
      this.props.gunpowder,
      warheadVolume,
      speedCoefficient
    );
    const speed = gunpowderSpeed.toFixed(2);
    return (
      <div style={{ margin: "0 0 0 auto", width: "max-content" }}>
        <label style={{ whiteSpace: "nowrap", right: 0 }}>
          {sentence["velocity"]}：
          <input
            type={"number"}
            style={{ textAlign: "right" }}
            readOnly={true}
            disabled={true}
            value={speed}
          />
          [m/s]
        </label>
      </div>
    );
  }
  calcGunpowder(
    warheadNum: number,
    gunpowderNum: number,
    warheadVolume: number,
    speedCoefficient: number
  ) {
    const speed =
      (700 * gunpowderNum * speedCoefficient * warheadVolume ** 0.03) /
      (warheadNum + gunpowderNum);
    return speed;
  }
  calcVolume(warheadLength: number, diameter: number) {
    const diameterM = diameter / 1000;
    const volume = (warheadLength * Math.PI * diameterM ** 2) / 4;
    return volume;
  }
  calcSpeedCoefficient(ammoList: AmmoData[]): number {
    const warheadNum = ammoList.length;
    const hasBaseBleeder = ammoList.find(e => e.id === "2") !== undefined;
    const warheadCofficientSum = ammoList.reduce(
      (accum, current, index) => accum + current.speedCofficient(index),
      0
    );
    const cofficient =
      (warheadCofficientSum / ((1 - 0.75 ** warheadNum) / (1 - 0.75))) *
      (hasBaseBleeder ? 1.2 : 1);
    return cofficient;
  }
}

export default CaluculateSpeed;
