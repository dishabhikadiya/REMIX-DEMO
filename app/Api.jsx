import { json } from "@remix-run/node";

const token = "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";
const url =
  "https://appmixo-disha.myshopify.com/admin/api/2023-10/graphql.json";
// PRODUCT DELETE API REST
export const deleteAPI = async (selectedAssetKey) => {
  try {
    const duplicatedAsset = await fetch(
      `https://appmixo-disha.myshopify.com/admin/api/2023-07/products/${selectedAssetKey}.json`,
      {
        method: "DELETE",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );
    return json({ actionData: duplicatedAsset });
  } catch (error) {
    throw error;
  }
};

// PRODUCT DATA CREATE API REST
export const dataCreate = async (detapost, status) => {
  try {
    const temp = { product: { title: detapost, status: status } };
    const data = await fetch(
      "https://appmixo-disha.myshopify.com/admin/api/2023-07/products.json",
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      }
    );
    return json({ actionData: data });
  } catch (error) {
    throw error;
  }
};

// PRODUCT DATA UPDATE API REST
export const update = async (updateId, updateTitle, updateSatus) => {
  console.log("updateId", updateId);
  console.log("updateTitle", updateTitle);
  try {
    const template = { product: { title: updateTitle, status: updateSatus } };
    const updateData = await fetch(
      `https://appmixo-disha.myshopify.com/admin/api/2023-07/products/${updateId}.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      }
    );
    return json({ actionData: updateData });
  } catch (error) {
    throw error;
  }
};

// CUSTOMER DATA GET API
export const grafGet = async () => {
  try {
    let productData = JSON.stringify({
      query:
        "query { customers(first: 10) { edges { node { id,firstName,email,phone, } } } }",
    });
    const data = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: productData,
    });
    console.log("productData-----", data);
    return json({ actionData: data });
  } catch (error) {
    console.log("-----------------", error);
    throw error;
  }
};

// CUSTOMER DATA DELETE
export const deleteGraf = async (id) => {
  console.log("==================================", id);
  try {
    let productData = JSON.stringify({
      query:
        "mutation customerDelete($id: ID!) { customerDelete(input: {id: $id}) { shop { id } userErrors { field message } deletedCustomerId } }",
      variables: {
        id: id,
      },
    });
    const deleteData = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: productData,
    });
    console.log("productData", deleteData);
    return json({ actionData: deleteData });
  } catch (error) {
    console.log("-----------------", error);
    throw error;
  }
};

// CUSTOMER DATA CREATE API
export const CreateGraf = async (firstName, email, phone) => {
  try {
    let productData = JSON.stringify({
      query:
        "mutation customerCreate($input: CustomerInput!) { customerCreate(input: $input) { userErrors { field message } customer { firstName email phone  } } }",
      variables: {
        input: {
          firstName: firstName,
          email: email,
          phone: phone,
        },
      },
    });
    const createData = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: productData,
    });
    console.log("createData", createData);
    let data = await createData.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// CUSTOMER DATA UPDATE API
export const UpdateGraf = async (
  id,
  updateFirstName,
  updateEmail,
  updatePhone
) => {
  try {
    let custmerData = JSON.stringify({
      query:
        "mutation customerUpdate($input: CustomerInput!) { customerUpdate(input: $input) { userErrors { field message } customer { id firstName email phone } } }",
      variables: {
        input: {
          id: id,
          firstName: updateFirstName,
          email: updateEmail,
          phone: updatePhone,
        },
      },
    });
    const updated = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: custmerData,
    });
    console.log("custmerData", custmerData);
    let updatedData = await updated.json();
    return updatedData;
  } catch (error) {
    console.log("----------------------------------", error);
    throw error;
  }
};
//CREATE ORDER API
export const CreateOrderAPI = async (customer, variant, quantity) => {
  try {
    var graphql = JSON.stringify({
      query:
        "mutation draftOrderCreate($input: DraftOrderInput!) {\r\n            draftOrderCreate(input: $input) {\r\n              draftOrder {\r\n                  id\r\n                  createdAt\r\n                  status\r\n              }\r\n              userErrors {\r\n                field\r\n                message\r\n              }\r\n            }\r\n          }",
      variables: {
        input: {
          customerId: customer,
          lineItems: [
            {
              variantId: variant,
              quantity: parseInt(quantity),
            },
          ],
        },
      },
    });
    const createDataOrder = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: graphql,
    });
    let dataOrder = await createDataOrder.json();
    console.log("createDataOrder", dataOrder);
    if (createDataOrder) {
      let completeOrder = dataOrder.data.draftOrderCreate.draftOrder.id;
      try {
        var graphqlcomplate = JSON.stringify({
          query:
            "mutation draftOrderComplete($id: ID!) { draftOrderComplete(id: $id) { draftOrder { id order { id } } } }",
          variables: {
            id: completeOrder,
          },
        });
        const fetchingCompleteOrder = await fetch(url, {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": token,
            "Content-Type": "application/json",
          },
          body: graphqlcomplate,
        });
        let datacomplete = await fetchingCompleteOrder.json();
        console.log("datacomplete", datacomplete);
        return datacomplete;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// fulfillmentOrders update
export const fulfillmentOrders = async (fulfillmentOrderId) => {
  try {
    var fulfillment = JSON.stringify({
      query:
        "mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) { fulfillmentCreateV2(fulfillment: $fulfillment) { fulfillment { id status } userErrors { field message } } }",
      variables: {
        fulfillment: {
          lineItemsByFulfillmentOrder: {
            fulfillmentOrderId: fulfillmentOrderId,
          },
        },
      },
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: fulfillment,
    });
    let data = await response.json();
    console.log("dataResponse", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
