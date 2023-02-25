import React from "react";
import axios from "axios";

const ExampleComponent = () => {
  const apiKey = "b0c5895bb79541db60e15e0d7332bec4";
  const baseUrl = "https://api.novaposhta.ua/v2.0/json/";

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
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
};
