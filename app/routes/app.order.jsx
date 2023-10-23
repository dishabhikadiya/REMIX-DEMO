import { useState, useCallback } from "react";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import {
  Page,
  LegacyCard,
  DataTable,
  Select,
  TextField,
} from "@shopify/polaris";
import { CreateOrderAPI, fulfillmentOrders } from "../Api";
import { Button } from "@shopify/polaris";
import { useActionData } from "@remix-run/react";

const token = "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";
export const loader = async ({ request }) => {
  console.log("testingData");
  await authenticate.admin(request);
  try {
    let productData = JSON.stringify({
      query: `query { orders(first: 20) { edges { node { id , displayFulfillmentStatus , email , name fulfillmentOrders(first: 1) {
          edges {
            node {
              id
              status
            }
          }
        } } } } }`,
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
    console.log("productData", productData);
    data = await data.json();
    console.log("data", data);
    console.log("productData", productData);
    return data;
  } catch (error) {
    console.log("-----------------", error);
    throw error;
  }
};
export async function action({ request }) {
  // @ts-ignore
  const { admin } = await authenticate.admin(request);
  const body = await request.formData();
  console.log("=}}}}", body);
  if (request.method === "POST") {
    try {
      const val1 = body.get("selected");
      const val2 = body.get("value");
      const val3 = body.get("quantitiy");
      const dataCreate = await CreateOrderAPI(val1, val2, val3);
      return json({ actionData: dataCreate });
    } catch (error) {
      console.log("error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
  if (request.method === "PUT") {
    try {
      const val = body.get("id");
      const orderID = await fulfillmentOrders(val);
      return json({ actionData: orderID });
    } catch (error) {
      console.log("error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
}
const customur = () => {
  // @ts-ignore
  const actionData = useActionData();
  const submit = useSubmit();
  const Loaderdata = useLoaderData();
  console.log("Loaderdata", Loaderdata);
  const Orders = Loaderdata?.data?.orders?.edges?.map((items) => items.node);
  const fulfillmentOrders = (id) => {
    const ordersFill = {
      _action: "post",
      id: id,
    };
    console.log("ordersFill", ordersFill);
    console.log("-----", id);
    // @ts-ignore
    submit(ordersFill, { method: "PUT" });
  };
  const rows = Orders?.map((form) => [
    [<>{form.id}</>],
    [
      <div>
        {form.displayFulfillmentStatus === "UNFULFILLED" ? (
          <button
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
            }}
            onClick={() =>
              fulfillmentOrders(form.fulfillmentOrders.edges[0].node.id)
            }
          >
            UNFULFILLED
          </button>
        ) : (
          <button
            style={{
              background: "green",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
            }}
          >
            FILLED
          </button>
        )}
      </div>,
    ],
    [<>{form.name}</>],
    [<>{form.email}</>],
  ]);
  const [selected, setSelected] = useState("");

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const [value, setValue] = useState("");

  const handleSelectChangeinput = useCallback((value) => setValue(value), []);

  const [quantitiy, setQuantitiy] = useState("1");

  const handleChange = useCallback((newValue) => setQuantitiy(newValue), []);

  const options = [
    {
      label: "gid://shopify/Customer/7310795407636",
      value: "gid://shopify/Customer/7310795407636",
    },
    {
      label: "gid://shopify/Customer/7249846534420",
      value: "gid://shopify/Customer/7249846534420",
    },
    {
      label: "gid://shopify/Customer/7249846501652",
      value: "gid://shopify/Customer/7249846501652",
    },
  ];
  const option = [
    {
      label: "gid://shopify/ProductVariant/47032802312468",
      value: "gid://shopify/ProductVariant/47032802312468",
    },
    {
      label: "gid://shopify/ProductVariant/47032928665876",
      value: "gid://shopify/ProductVariant/47032928665876",
    },
    {
      label: "gid://shopify/ProductVariant/47028245790996",
      value: "gid://shopify/ProductVariant/47028245790996",
    },
  ];
  const order = () => {
    const createOrder = {
      _action: "post",
      selected: selected,
      value: value,
      quantitiy: quantitiy,
    };
    console.log("createOrder", createOrder);
    submit(createOrder, { method: "POST" });
  };
  return (
    <Page title="Order">
      <Select
        label="Customer_Id"
        options={options}
        onChange={handleSelectChange}
        value={selected}
      />
      <br />
      <Select
        label="Product_ID"
        options={option}
        onChange={handleSelectChangeinput}
        value={value}
      />
      <br />
      <TextField
        label="Quantity"
        type="number"
        value={quantitiy}
        onChange={handleChange}
        autoComplete="off"
      />
      <br />
      <Button primary onClick={order}>
        Submit
      </Button>
      <br />
      <br />
      <div>
        <LegacyCard>
          <DataTable
            columnContentTypes={[
              "text",
              "numeric",
              "numeric",
              "numeric",
              "numeric",
            ]}
            headings={["Id", "Fulfillment_Status", "Product Name", "Email"]}
            rows={rows}
          />
        </LegacyCard>
      </div>
    </Page>
  );
};

export default customur;
