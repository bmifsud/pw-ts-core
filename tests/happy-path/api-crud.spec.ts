import { test, expect } from '../../utils/test-setup';

test.describe('API CRUD Operations', () => {
  const baseURL = 'https://restful-booker.herokuapp.com';
  let token: string;
  let bookingId: number;

  test.beforeAll(async ({ request }) => {
    // Authenticate and get token
    const authResponse = await request.post(`${baseURL}/auth`, {
      data: {
        username: "admin",
        password: "password123"
      }
    });
    expect(authResponse.ok()).toBeTruthy();
    const body = await authResponse.json();
    token = body.token;
    expect(token).toBeDefined();
  });

  test('Create, Read, Update, and Delete a Booking', async ({ request }) => {
    // 1. Create (POST)
    const newBooking = {
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
            checkin: "2024-01-01",
            checkout: "2024-01-02"
        },
        additionalneeds: "Breakfast"
    };

    const createResponse = await request.post(`${baseURL}/booking`, {
        data: newBooking
    });
    expect(createResponse.status()).toBe(200);
    const createBody = await createResponse.json();
    bookingId = createBody.bookingid;
    expect(bookingId).toBeDefined();
    expect(createBody.booking.firstname).toBe(newBooking.firstname);

    // 2. Read (GET)
    const readResponse = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(readResponse.status()).toBe(200);
    const readBody = await readResponse.json();
    expect(readBody.firstname).toBe(newBooking.firstname);

    // 3. Update (PUT)
    const updatedBooking = {
        ...newBooking,
        firstname: "James"
    };
    const updateResponse = await request.put(`${baseURL}/booking/${bookingId}`, {
        headers: {
            'Cookie': `token=${token}`,
            'Accept': 'application/json'
        },
        data: updatedBooking
    });
    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();
    expect(updateBody.firstname).toBe("James");

    // 4. Delete (DELETE)
    const deleteResponse = await request.delete(`${baseURL}/booking/${bookingId}`, {
        headers: {
            'Cookie': `token=${token}`
        }
    });
    expect(deleteResponse.status()).toBe(201); // restful-booker returns 201 Created on DELETE

    // Verify deletion
    const verifyResponse = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(verifyResponse.status()).toBe(404);
  });
});
