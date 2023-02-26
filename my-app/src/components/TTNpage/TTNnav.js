import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import "./TTN.scss";

const TTNNav = () => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState({});
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const apiKey = "b0c5895bb79541db60e15e0d7332bec4";
  const baseUrl = "https://api.novaposhta.ua/v2.0/json/";

  useEffect(() => {
    const historyFromLocalStorage = localStorage.getItem("history");

    if (historyFromLocalStorage) {
      setHistory(JSON.parse(historyFromLocalStorage));
    }
  }, []);

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
    setValue(e.target.value);
    setError("");
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const status = await getDeliveryStatus(value);
    if (status) {
      setStatus(status);

      if (!history.includes(value)) {
        const newHistory = [...history, value];
        setHistory(newHistory);
        localStorage.setItem("history", JSON.stringify(newHistory));
      }
    } else {
      setError(<div>This TTN does not exist, try another one</div>);
    }
  };

  const removeHistoryItem = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  };

  return (
    <>
      <nav className="navigation">
        <Link to="/">
          <div className="navigationButton">
            <button>Check ТТН</button>
          </div>
        </Link>
        <Link to="/Branches">
          <div className="navigationButton">
            <button>List of branches</button>
          </div>
        </Link>
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
              {value.trim() && !value.match(/^[0-9]{14}$/) && (
                <div className="error-message">Incorrect TTN number</div>
              )}
              {error && <div className="error-message">{error}</div>}
            </div>
          </Form>
        </Formik>
      </div>
      <div className="DisplayHistory">
        <div className="display">
          <p>Status: {status.Status} </p>
          <p>Sent: {status.Warehouse} </p>
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
