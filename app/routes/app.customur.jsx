import { useState } from "react";
import { useActionData } from "@remix-run/react";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { Page, LegacyCard, DataTable, Card } from "@shopify/polaris";
import { Button } from "@shopify/polaris";
import { deleteGraf, CreateGraf, UpdateGraf } from "../Api";
import { TextField } from "@shopify/polaris";
import { useCallback } from "react";
import { Modal } from "@shopify/polaris";
const token = "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";
export const loader = async ({ request }) => {
  console.log("testingData");
  await authenticate.admin(request);
  try {
    let productData = JSON.stringify({
      query:
        "query { customers(first: 10) { edges { node { id,firstName,email,phone } } } }",
    });
    let data = await fetch(
      "https://appmixo-disha.myshopify.com/admin/api/2023-10/graphql.json",
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: productData,
      }
    );
    data = await data.json();
    console.log("data=========", data);

    console.log("productData", productData);
    return data;
  } catch (error) {
    console.log("-----------------", error);
    throw error;
  }
};
export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const body = await request.formData();
  console.log("=========================", request.method);
  console.log("helooooooooooooo", body);
  if (request.method === "DELETE") {
    try {
      const selectedAssetKey = body.get("id");
      console.log("selectedAssetKey", selectedAssetKey);
      const duplicatedAsset = await deleteGraf(selectedAssetKey);

      return json({ actionData: duplicatedAsset });
    } catch (error) {
      console.error("Error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
  if (request.method === "POST") {
    try {
      const value = body.get("value");
      const valueemail = body.get("valueEmail");
      const valuePhone = body.get("valuePhone");
      const submiteButton = await CreateGraf(value, valueemail, valuePhone);
      return json({ actionData: submiteButton });
    } catch (error) {
      return json({ error: "Error" }, { status: 500 });
    }
  }

  if (request.method === "PUT") {
    try {
      const getId = body.get("id");
      const val1 = body.get("updateName");
      const val2 = body.get("updateEmail");
      const val3 = body.get("updatePhone");
      const update = await UpdateGraf(getId, val1, val2, val3);
      console.log("update", update);
      return json({ actionData: update });
    } catch (error) {
      console.log("error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
}
const customur = () => {
  const actionData = useActionData();
  const submit = useSubmit();
  console.log(actionData);
  const Loadeddata = useLoaderData();
  const Customers = Loadeddata.data.customers.edges.map((items) => items.node);
  console.log(Customers);
  const deleteCustomer = async (id) => {
    const deleteData = {
      _action: "delete",
      id: id,
    };
    console.log("data", deleteData);
    submit(deleteData, { method: "DELETE" });
  };

  //Name
  const [value, setValue] = useState("");
  const handleChange = useCallback((newValue) => setValue(newValue), []);

  //Email
  const [valueEmail, setValueEmail] = useState("");
  const handleChangeEmail = useCallback(
    (newValueEmail) => setValueEmail(newValueEmail),
    []
  );

  //Phone Number Value
  const [valuePhone, setValuePhone] = useState("");
  const handleChangePhone = useCallback(
    (newValuePhone) => setValuePhone(newValuePhone),
    []
  );
  //Model
  const [active, setActive] = useState(false);
  const [id, setId] = useState();
  const handleChange1 = useCallback(() => setActive(!active), [active]);
  const [updateName, setUpdateName] = useState();
  const handleChangename = useCallback((val) => setUpdateName(val), []);
  const [updateEmail, SetUpdateEmail] = useState();
  const handleChangemail = useCallback((val) => SetUpdateEmail(val), []);
  const [updatePhone, setUpdatePhone] = useState();
  const handleChangphone = useCallback((val) => setUpdatePhone(val), []);
  const [product, setProducts] = useState();
  const dataCreate = () => {
    const createData = {
      _action: "post",
      value: value,
      valueEmail: valueEmail,
      valuePhone: valuePhone,
    };
    console.log("createData", createData);
    submit(createData, { method: "POST" });
    setValue("");
    setValueEmail("");
    setValuePhone("");
  };

  const update = () => {
    const actionDataUpdate = {
      id: id,
      updateName: updateName,
      updateEmail: updateEmail,
      updatePhone: updatePhone,
    };
    // @ts-ignore
    submit(actionDataUpdate, { method: "PUT" });
    // @ts-ignore
    setUpdateName("");
    // @ts-ignore
    SetUpdateEmail("");
    // @ts-ignore
    setUpdatePhone("");
    setActive(false);
    console.log("updated", actionDataUpdate);
  };
  const rows = Customers.map((form) => [
    [<>{form.firstName}</>],
    [<>{form.email}</>],
    [<>{form.phone}</>],
    <div
      style={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <div onClick={() => setId(form.id)}>
        <Button plain onClick={handleChange1}>
          UPDATE
        </Button>
        &nbsp; &nbsp;
      </div>
      <Button plain destructive onClick={() => deleteCustomer(form.id)}>
        DELETE
      </Button>
    </div>,
  ]);
  console.log("id", id);
  return (
    <Page title="Customer">
      <TextField
        label="First Name"
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
      <br />
      <TextField
        label="Email"
        type="email"
        value={valueEmail}
        onChange={handleChangeEmail}
        autoComplete="email"
      />
      <br />
      <TextField
        label="PhoneNo."
        type="number"
        value={valuePhone}
        onChange={handleChangePhone}
        autoComplete="off"
        // requiredIndicator
      />
      <br />
      <Button primary onClick={dataCreate}>
        Submit
      </Button>
      <br />
      <br />
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "numeric", "numeric", "numeric"]}
          headings={["FirstName", "Email", "Phone", "Action"]}
          rows={rows}
        />
      </LegacyCard>
      {/* ======================== Model =============================== */}
      <Modal
        // activator={activator}
        open={active}
        onClose={handleChange1}
        title="Edit Customer"
      >
        <Modal.Section>
          <TextField
            label="First Name"
            value={updateName}
            onChange={handleChangename}
            autoComplete="off"
          />
          <br />
          <TextField
            label="Email"
            type="email"
            value={updateEmail}
            onChange={handleChangemail}
            autoComplete="email"
          />
          <br />
          <TextField
            label="PhoneNo."
            type="number"
            value={updatePhone}
            onChange={handleChangphone}
            autoComplete="off"
            // requiredIndicator
          />
          <br />
          <Button primary onClick={update}>
            Submit
          </Button>
        </Modal.Section>
      </Modal>
    </Page>
  );
};

export default customur;
