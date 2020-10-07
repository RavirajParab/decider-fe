/* eslint-disable default-case */
import React, { useEffect } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const Notifier = (props) => {
  
  const btnNotification = React.createRef();
  const createNotification = (type,message) => {
    return () => {
      switch (type) {
        case "info":
          NotificationManager.info(
            "Success message",
            "Close after 1000ms",
            1000
          );
          break;
        case "success":
          NotificationManager.success(
             "success",
             message,
            1000
          );
          break;
        case "warning":
          NotificationManager.warning(
            "Warning message",
            "Close after 1000ms",
            1000
          );
          break;
        case "error":
          NotificationManager.error("Error message", "Click me!", 5000, () => {
            alert("callback");
          });
          break;
      }
    };
  };
 
  useEffect(() => {
      console.log(props);
      btnNotification.current.click();
  })
  return (
    <React.Fragment>
      {props.data.type} {props.data.message}
      <button ref={btnNotification}
        style={{ display: "none" }}
        onClick={createNotification(props.data.type,props.data.message)}
      >
        Click me
      </button>
      <NotificationContainer />
    </React.Fragment>
  );
};

export default Notifier;
