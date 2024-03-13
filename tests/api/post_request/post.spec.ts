import { expect, test } from '@playwright/test';

const baseURL = "https://reqres.in";

test.describe("API POST requests", () => {
    test("API POST request - create a new user", async({ request }) => {
        const response = await request.post(`${baseURL}/api/users`, {data: {
            "name": "ionel",
            "job": "leader"
        }});

        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(201);
        expect(responseBody.name).toEqual("ionel");
        expect(responseBody.job).toEqual("leader");
    })
})