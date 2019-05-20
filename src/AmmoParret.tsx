import * as React from "react";
import { render } from "react-dom";
import AmmoData from "./ammoList";
import uuid from "uuid";

import "./styles.css";

interface AmmoSelectorProp {
  isHead: boolean;
  isRear: boolean;
  value: string;
  ammoDataList: AmmoData[];
  onChange: (event: any) => void;
}
class AmmoSelector extends React.Component<AmmoSelectorProp> {
  constructor(props: AmmoSelectorProp) {
    super(props);
  }
  render() {
    const option = (this.props.ammoDataList || [])
      .filter(ammo => ammo.id !== "-")
      .filter(ammo => this.props.isHead || /[^a-z]/.test(ammo.id))
      .filter(
        ammo =>
          (this.props.isRear && !this.props.isHead) || /[^0-5]/.test(ammo.id)
      )
      .map(ammo => {
        const disabled = ammo.id.length !== 1;
        const color = disabled ? "whitesmoke" : "black";
        const bgColor = disabled ? "chocolate" : "#e0e0e0";
        return (
          <option
            key={uuid.v4()}
            value={ammo.id}
            disabled={disabled}
            style={{ color: color, backgroundColor: bgColor }}
          >
            {ammo.name}
          </option>
        );
      });
    return (
      <select
        key={uuid.v4()}
        defaultValue={this.props.value}
        onChange={this.props.onChange}
      >
        {option}
      </select>
    );
  }
}

interface AmmoParretProp {
  ammoSelectorId: string[];
  setAmmoList: (ammoList: string[]) => void;
  ammoDataList: AmmoData[];
}
function AmmoParret(props: AmmoParretProp) {
  return (
    <div style={{ flex: "auto", height: "100%" }}>
      <ol
        style={{
          overflowY: "scroll",
          height: "100%",
          margin: "0 0 auto auto"
        }}
      >
        {props.ammoSelectorId
          .slice()
          .reverse()
          .map((selector, index, array) => (
            <li key={uuid.v4()}>
              <AmmoSelector
                isHead={index === array.length - 1}
                isRear={index === 0}
                value={selector}
                ammoDataList={props.ammoDataList}
                onChange={event => {
                  const ammoSelectorId = props.ammoSelectorId.slice();
                  ammoSelectorId[array.length - 1 - index] = event.target.value;
                  props.setAmmoList(ammoSelectorId);
                }}
              />
              <button
                onClick={() => {
                  const ammoSelectorId = props.ammoSelectorId.slice();
                  const currentId = ammoSelectorId[array.length - 1 - index];
                  const copyId = index !== array.length - 1 ? currentId : "A";
                  ammoSelectorId.splice(array.length - index, 0, copyId);
                  props.setAmmoList(ammoSelectorId);
                }}
                disabled={
                  !(array.length < 60 && (array.length === 1 || index !== 0))
                }
              >
                {"add"}
              </button>
              <button
                onClick={() => {
                  const ammoSelectorId = props.ammoSelectorId.slice();
                  ammoSelectorId.splice(array.length - index - 1, 1);
                  props.setAmmoList(ammoSelectorId);
                }}
                disabled={array.length === 1}
              >
                {"del"}
              </button>
            </li>
          ))}
      </ol>
    </div>
  );
}

export default AmmoParret;
