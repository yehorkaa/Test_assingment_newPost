import React from "react";
import "./TTN.scss";

const TTNDisplay = (props) => {
    console.log(props)
  return (
    <div className="DisplayHistory">
      <div className="display">
        <p>Status: {props.status.Status}  </p>
        <p>Sent: {props.status.WarehouseSender}</p>
        <p>Obtained: {props.status.WarehouseRecipient}</p>
      </div>
      <div className="history">
        <span>History</span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default TTNDisplay;
