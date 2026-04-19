import img1 from "../assets/mock image/1.jpg";
import img2 from "../assets/mock image/2.jpg";
import img3 from "../assets/mock image/3.jpg";

const originalFetch = window.fetch;

const mockPlants = [
  {
    id: 1,
    name: "Check 1",
    description: "Hi Check 1",
    imageUrl: img1,
    status: "AVAILABLE",
    ownerId: 1,
    ownerName: "Sanjay",
    difficulty: "MEDIUM",
    type: "STANDARD",
    categoryId: 1,
  },
  {
    id: 2,
    name: "Check 2",
    description: "Hi Check 2",
    imageUrl: img2,
    status: "AVAILABLE",
    ownerId: 2,
    ownerName: "Ajay",
    difficulty: "MEDIUM",
    type: "STANDARD",
    categoryId: 1,
  },
  {
    id: 3,
    name: "Check 3",
    description: "Hi Check 3",
    imageUrl: img3,
    status: "AVAILABLE",
    ownerId: 1,
    ownerName: "Rahul",
    difficulty: "EASY",
    type: "STANDARD",
    categoryId: 2,
  },
];

const mockMember = {
  id: 1,
  username: "PlantLover99",
  email: "demo@plant-swap.com",
  location: "Demo City",
  joinedDate: "2023-01-01",
};

const mockData = {
  "/api/v1/plants": { success: true, data: mockPlants },
  "/api/v1/plants/1": { success: true, data: mockPlants[0] },
  "/api/v1/plants/2": { success: true, data: mockPlants[1] },
  "/api/v1/plants/3": { success: true, data: mockPlants[2] },
  "/api/v1/categories": {
    success: true,
    data: [
      { id: 1, name: "Indoor Plants" },
      { id: 2, name: "Succulents" },
      { id: 3, name: "Outdoor Plants" },
    ],
  },
  "/api/v1/members/login": {
    success: true,
    token: "demo-jwt-token-123",
    member: mockMember,
  },
  "/api/v1/members/register": {
    success: true,
    token: "demo-jwt-token-123",
    member: mockMember,
  },
  "/api/v1/members/1": { success: true, data: mockMember },
  "/api/v1/requests": { success: true, data: [] },
  "/api/v1/feedback/member/1": { success: true, data: [] },
  "/api/v1/feedback/member/2": { success: true, data: [] },
};

export function setupMockApi() {
  window.fetch = async (...args) => {
    const [resource, config] = args;
    const url = typeof resource === "string" ? resource : resource.url;

    // Only intercept requests to our own API
    const isOurApi = url.includes("/api/v1");

    // Clean URL to match mock paths
    const cleanUrl = url.replace("http://localhost:8080", "");
    const method = config?.method?.toUpperCase() || "GET";

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Attempt real fetch first
      const response = await originalFetch(...args);

      // If deployed without a backend, typical proxies return 404/504
      // We only fallback to mock if this is our API and it failed
      if (
        isOurApi &&
        !response.ok &&
        response.status >= 400 &&
        response.status !== 401 &&
        response.status !== 403
      ) {
        throw new Error(
          `Real backend is unavailable (Status: ${response.status})`,
        );
      }
      return response;
    } catch (error) {
      if (!isOurApi) {
        // If it's a Cloudinary or other external upload that fails, don't mock it
        throw error;
      }

      console.warn(
        `[Mock API fallback] Intercepted failed request to ${url}. Returning demo data.`,
      );
      await delay(600); // Simulate network request for realism

      // Special case handling for POST/PUT/DELETE
      if (method !== "GET" && method !== "DELETE") {
        if (cleanUrl.includes("/login") || cleanUrl.includes("/register")) {
          return new Response(
            JSON.stringify(mockData["/api/v1/members/login"]),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        return new Response(
          JSON.stringify({
            success: true,
            message: "Demo mock action successful",
            id: 999,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (method === "DELETE") {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check standard GET endpoints
      const matchedKey = Object.keys(mockData).find(
        (key) => cleanUrl === key || cleanUrl === key + "/",
      );

      if (matchedKey) {
        return new Response(JSON.stringify(mockData[matchedKey]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Look for a partial match (e.g. dynamic IDs not strictly matched)
      if (cleanUrl.includes("/plants/")) {
        return new Response(
          JSON.stringify({ success: true, data: mockPlants[0] }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Default mock JSON empty array / object to prevent frontend crashes
      return new Response(JSON.stringify({ success: true, data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}
