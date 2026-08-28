import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // Mock Jira REST API for issue creation
  http.post('https://mock-jira.atlassian.net/rest/api/2/issue', async ({ request }) => {
    const requestBody = await request.json() as any;

    // Basic validation of expected Jira payload structure
    if (!requestBody.fields || !requestBody.fields.project || !requestBody.fields.summary) {
      return HttpResponse.json({ errorMessages: ["Invalid payload"] }, { status: 400 });
    }

    return HttpResponse.json({
      id: "10000",
      key: "BUG-123",
      self: "https://mock-jira.atlassian.net/rest/api/2/issue/10000"
    }, { status: 201 });
  }),

  // Mock API endpoints for Negative Path testing (4xx/5xx)
  http.get('https://api.example.com/data-500', async () => {
    await delay(500); // Simulate network latency
    return HttpResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }),

  http.get('https://api.example.com/data-404', async () => {
    return HttpResponse.json({ message: "Not Found" }, { status: 404 });
  })
];
