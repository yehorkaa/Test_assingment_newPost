import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
const BranchesList = () => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://api.novaposhta.ua/v2.0/json/AddressGeneral/getWarehouses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              apiKey: "b0c5895bb79541db60e15e0d7332bec4",
              modelName: "AddressGeneral",
              calledMethod: "getWarehouses",
              methodProperties: {
                Language: 'ua',
                Limit: 10
              },
            }),
          }
        );
        const result = await response.json();
        setBranches(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBranches();
  }, []);

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
      <div className="branchesList">
        {branches.map((branch) => (
          <ul className="branch" key={uuidv4()}>
            <li>{branch.Description}</li>
            <li>{branch.DescriptionRu}</li>
          </ul>
        ))}
      </div>
    </>
  );
};


export default BranchesList;
