const functions = require("firebase-functions");
const Yup = require("yup");
const serverTimestamp =
  require("firebase-admin").firestore.FieldValue.serverTimestamp;

const admin = require("../admin");
const { validateAdmin } = require("../utils/roles");

const auth = admin.auth();
const db = admin.firestore();

function validateFields(data) {
  console.log({ data });
  let schema = Yup.object().shape({
    name: Yup.string().required(),
    status: Yup.string().required(),
    industry: Yup.string().required(),
    phone: Yup.string().required(),
    address: Yup.string().required(),
    city: Yup.string().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    contactPhone: Yup.string().required(),
    website: Yup.string(),
  });

  try {
    return schema.isValid(data);
  } catch (error) {
    console.log(error);
  }
}

module.exports = functions.https.onCall(async function (data, context) {
  const { role, name } = context.auth.token;
  console.log({ role, name });
  try {
    validateAdmin(role);

    const dataValid = await validateFields(data);

    if (!dataValid) {
      throw new Error("Submitted data is not valid!");
    }

    function checkOrg(name) {
      return db
        .collection("organizations")
        .where("name", "==", name)
        .limit(1)
        .get()
        .then((snap) => snap.empty);
    }

    const isNewOrg = checkOrg(data.name);
    if (!isNewOrg) {
      throw new Error("An organization with a similar name already exists!");
    }
    console.log({ name });

    await db.collection("organizations").add({
      ...data,
      createdBy: name,
      modifiedBy: name,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });

    return "Organization successfully created!";
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(
      error.code || "unknown",
      error.message || "unknown error!"
    );
  }
});
