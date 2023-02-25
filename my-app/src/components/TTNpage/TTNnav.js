import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./TTN.scss";
const TTNNav = () => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);

  const apiKey = "b0c5895bb79541db60e15e0d7332bec4";
  const baseUrl = "https://api.novaposhta.ua/v2.0/json/";

  useEffect(() => {
    const historyFromLocalStorage = localStorage.getItem("history");
    if (historyFromLocalStorage) {
      setHistory(JSON.parse(historyFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const getDeliveryStatus = async (trackingNumber) => {
    const data = {
      apiKey,
      modelName: "TrackingDocument",
      calledMethod: "getStatusDocuments",
      methodProperties: {
        Documents: [{ DocumentNumber: trackingNumber }],
      },
    };
    try {
      const response = await axios.post(baseUrl, data);
      const status = response.data.data[0];
      return status;
    } catch (error) {
      console.log(error);
    }
  };
  const onHandleInput = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const status = await getDeliveryStatus(value);
    if (status) {
      setStatus(status);
      if (!history.includes(value)) {
        setHistory([...history, value]);
      }
      setValue("");
    }
  };
  
  const removeHistoryItem = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  return (
    <>
      <nav className="navigation">
        <div className="navigationButton">
          <button>Check ТТН</button>
        </div>
        <div className="navigationButton">
          <button>List of branches</button>
        </div>
      </nav>
      <div className="TTNInputButton">
        <Formik
          className="TTNInputForm"
          initialValues={{
            TTNnumber: "",
          }}
          validationSchema={Yup.object({
            TTNnumber: Yup.string().matches(
              /^[0-9]{14}$/,
              "Incorrect TTN number"
            ),
          })}
          onSubmit={onHandleSubmit}
        >
          <Form onSubmit={onHandleSubmit}>
            <Field
              className="TTNInput"
              type="text"
              name="TTNnumber"
              value={value}
              onChange={onHandleInput}
            />
            <ErrorMessage name="TTNnumber" component="div" />
            <div className="TTNButton">
              <button
                type="submit"
                disabled={!value.trim() || !value.match(/^[0-9]{14}$/)}
              >
                Get status TTN
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="DisplayHistory">
        <div className="display">
          <p>Status: {status.Status} </p>
          <p>Sent: {status.WarehouseSender}</p>
          <p>Obtained: {status.WarehouseRecipient}</p>
        </div>
        <div className="history">
          <span>History</span>
          {history.slice(0, 4).map((item, index) => (
            <div key={index} className="history-item">
              {item}
              <button onClick={() => removeHistoryItem(index)}>X</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default TTNNav;
