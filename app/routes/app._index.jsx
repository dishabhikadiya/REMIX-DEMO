import { json } from "@remix-run/node";
import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Page, Button } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { LegacyCard } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import { deleteAPI, dataCreate, update, grafGet } from "../Api";
import { TextField } from "@shopify/polaris";
import { ChoiceList } from "@shopify/polaris";
import { DataTable } from "@shopify/polaris";
import { EditMinor } from "@shopify/polaris-icons";
import { Icon, Modal, Toast, Frame } from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
const token = "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";
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const temp = await grafGet();
  console.log("temp", temp);
  try {
    const response = await fetch(
      "https://appmixo-disha.myshopify.com/admin/api/2023-07/products.json",
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": token,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch assets for the published theme");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const body = new URLSearchParams(await request.text());
  if (body.get("_action") === "delete") {
    try {
      const selectedAssetKey = body.get("id");
      const duplicatedAsset = await deleteAPI(selectedAssetKey);

      return json({ actionData: duplicatedAsset });
    } catch (error) {
      console.error("Error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
  if (body.get("_action") === "create") {
    try {
      const selectedAssetKey1 = body.get("textFieldValue");
      const selectedAssetKey2 = body.get("selectedinput");
      const duplicatedAsset1 = await dataCreate(
        selectedAssetKey1,
        selectedAssetKey2
      );

      return json({ actionData: duplicatedAsset1 });
    } catch (error) {
      console.error("Error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
  if (body.get("_action") === "update") {
    try {
      const selectedAssetKey3 = body.get("id");
      const editvalue = body.get("updateTitle");
      const selectedAssetKey0 = body.get("value");
      const duplicatedAsset2 = await update(
        selectedAssetKey3,
        editvalue,
        selectedAssetKey0
      );
      return json({ actionData: duplicatedAsset2 });
    } catch (error) {
      console.error("Error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
}

export default function Index() {
  const nav = useNavigation();
  const nave = useNavigate();
  const actionData = useActionData();
  const submit = useSubmit();
  const Loaderdata = useLoaderData();
  const [id, setId] = useState();
  console.log(Loaderdata);
  console.log(id);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [message, setMessage] = useState("");
  console.log("message", message);
  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    []
  );
  const [value, setValue] = useState("");
  const handleChangeUpdate = useCallback((value1) => setValue(value1), []);
  const [updateTitle, setUpdateTitle] = useState("");
  const handleTextFieldChangevalue = useCallback(
    (value) => setUpdateTitle(value),
    []
  );
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const deleteProduct = async () => {
    const deleteData = {
      _action: "delete",
      id: id,
    };
    console.log("data", deleteData);
    // @ts-ignore
    submit(deleteData, { method: "POST" });
  };
  const [active1, setActive1] = useState(false);
  const toggleActive = useCallback(() => setActive1((active1) => !active1), []);
  const toster = active1 ? (
    <Toast content="Product Create Successfully" onDismiss={toggleActive} />
  ) : null;
  const create = async () => {
    const data2 = {
      _action: "create",
      textFieldValue: textFieldValue,
      selectedinput: selectedinput,
    };
    console.log("data", data2);
    submit(data2, { method: "POST" });
    setTextFieldValue("");
    setSelectedinput("");
    if (data2) {
      toggleActive();
    }
    if (!data2) {
      setMessage("dddddddddddddd");
    }
  };
  const updateTitlee = async () => {
    const data3 = {
      _action: "update",
      id: id,
      updateTitle: updateTitle,
      value: value,
    };
    console.log("data", data3);
    // @ts-ignore
    submit(data3, { method: "POST" });
    setActive(false);
  };
  console.log(updateTitle);
  const rows = Loaderdata.products.map((form) => [
    [<>{form.id}</>],
    [<>{form.title}</>],
    [<>{form.variants[0].price}</>],
    [<>{form.status}</>],
    [<>{form.vendor}</>],
    <span
      onClick={() => {
        setId(form.id);
      }}
      style={{ display: "flex" }}
    >
      <div>
        <Button
          icon={EditMinor}
          accessibilityLabel="Remove item"
          onClick={handleChange}
        />
      </div>
      &nbsp;&nbsp;
      <div>
        <Button
          icon={DeleteMinor}
          accessibilityLabel="Remove item"
          onClick={deleteProduct}
        />
      </div>
    </span>,
  ]);
  const [selectedinput, setSelectedinput] = useState("");
  console.log("selectedinput", selectedinput);
  const handleChange1 = useCallback((value) => setSelectedinput(value), []);
  console.log(textFieldValue);
  return (
    <Frame>
      <Page>
        <Modal
          // activator={activator}
          open={active}
          onClose={handleChange}
          title="Edit Product"
        >
          <Modal.Section>
            <TextField
              label="Store name"
              value={updateTitle}
              onChange={handleTextFieldChangevalue}
              selectTextOnFocus
              autoComplete="off"
            />
            <br />
            <ChoiceList
              title="Status"
              choices={[
                { label: "Active", value: "active" },
                { label: "Archived", value: "archived" },
                { label: "Draft", value: "draft" },
              ]}
              // @ts-ignore
              selected={value}
              onChange={handleChangeUpdate}
            />
            <br />
            <Button primary onClick={updateTitlee}>
              Submit
            </Button>
          </Modal.Section>
        </Modal>
        <span>
          {message}
          <TextField
            label="Store name"
            value={textFieldValue}
            onChange={handleTextFieldChange}
            selectTextOnFocus
            autoComplete="off"
          />
          <br />
          <ChoiceList
            title="Status"
            choices={[
              { label: "Active", value: "active" },
              { label: "Archived", value: "archived" },
              { label: "Draft", value: "draft" },
            ]}
            // @ts-ignore
            selected={selectedinput}
            onChange={handleChange1}
          />
          <br />
          <Button primary onClick={create}>
            Submit
          </Button>
          <br />
          <br />
        </span>
        <LegacyCard>
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "numeric",
              "numeric",
              "numeric",
            ]}
            headings={[
              "Product_id",
              "Title",
              "Price",
              "Status",
              "Vendor",
              "Action",
            ]}
            rows={rows}
          />
        </LegacyCard>
        {toster}
      </Page>
    </Frame>
  );
}
