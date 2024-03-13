import { expect, test } from "@playwright/test";

const baseURL = "https://reqres.in";

test.describe("API GET requests", () => {
  test("API GET request - assert response status", async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users?page=2`);
    const responseBody = JSON.parse(await response.text());
    const epxectedData = {
      id: 7,
      email: "michael.lawson@reqres.in",
      first_name: "Michael",
      last_name: "Lawson",
      avatar: "https://reqres.in/img/faces/7-image.jpg",
    };
    console.log(responseBody);
    expect(response.status()).toBe(200);
    expect(responseBody.data).toContainEqual(epxectedData);
  });

  test("API GET request - assert response status to invalid endpoint", async ({ request,}) => {
    const response = await request.get(`${baseURL}/ksnksnvkdv/flktf`);
    expect(response.status()).toBe(404);
  });

  test("API GET single user - assert response status and data", async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/2`);
    const responseBody = JSON.parse(await response.text());
    const expectedData = {
      id: 2,
      email: "janet.weaver@reqres.in",
      first_name: "Janet",
      last_name: "Weaver",
      avatar: "https://reqres.in/img/faces/2-image.jpg",
    };
    expect(response.status()).toBe(200);
    expect(responseBody.data.id).toBe(expectedData.id);
    expect(responseBody.data.email).toBe(expectedData.email);
    expect(responseBody.data.first_name).toBe(expectedData.first_name);
    expect(responseBody.data.last_name).toBe(expectedData.last_name);
    expect(responseBody.data.avatar).toBe(expectedData.avatar);
  });

  test("API GET unexistent user - assert response status", async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/23`);
    expect(response.status()).toBe(404);
  });

  test("API GET a list of resources - assert response status and data", async ({ request }) => {
    const response = await request.get(`${baseURL}/api/unknown`);
    const responseBody = JSON.parse(await response.text());
    expect(responseBody.page).toBe(1);

    let data: any[] = responseBody.data;
    const expectedData = {
      id: 3,
      name: "true red",
      year: 2002,
      color: "#BF1932",
      pantone_value: "19-1664",
    };
    expect(data.length).toBe(6);
    expect(data[2].id).toEqual(expectedData.id);
    expect(data[2].name).toEqual(expectedData.name);
    expect(data[2].year).toEqual(expectedData.year);
    expect(data[2].color).toEqual(expectedData.color);
    expect(data[2].pantone_value).toEqual(expectedData.pantone_value);
  });
});