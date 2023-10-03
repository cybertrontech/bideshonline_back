import admin from "firebase-admin";
import serviceAccount from "../service_json.json" assert { type: "json" };
import { CustomError } from "../error/CustomError.mjs";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://sample-project-e1a84.firebaseio.com"
});
const sendNotification = async (fmwToken, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token: fmwToken,
  };

  await admin.messaging().send(message);

  // .then((response) => {
  //   return res.status(200).send("Notification sent successfully");
  // })
  // .catch((e) => {
  //   // console.log(e);
  //   return next(new CustomError(500, "Error in notification sending."));
  // });
};

const sendNotificationAtBulk = async (fmwTokens, title, body) => {
  const message = {
    notification: {
      title,
      body,
      type:"global_push"
    },
  };


  await admin
    .messaging()
    .sendMulticast({ tokens: fmwTokens, notification: message.notification });
};

export { sendNotification, sendNotificationAtBulk };
