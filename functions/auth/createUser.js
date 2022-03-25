const functions = require("firebase-functions");
const admin = require("../admin");

const auth = admin.auth();

exports.createUser = functions.https.onCall(async function (data, context) {
  try {
    const userRecord = await auth.createUser({
      displayName: "Super Admin",
      email: "kibzbiz@gmail.com",
      emailVerified: true,
      password: "invoiced@kibra08",
    });

    await auth.setCustomUserClaims(userRecord.uid, {
      role: "super_admin",
    });

    return "user created successfully";
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(
      error.code || "unknown",
      error.message || "unknown error!"
    );
  }
});
