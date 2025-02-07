const request = require("supertest");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = require("../server"); // Make sure path is correct

describe("Report API Tests", () => {
  // Test XML file setup
  const mockXML = `
  <INProfileResponse>
    <Current_Application>
      <Current_Application_Details>
        <Current_Applicant_Details>
          <First_Name>John</First_Name>
          <Last_Name>Doe</Last_Name>
          <MobilePhoneNumber>1234567890</MobilePhoneNumber>
        </Current_Applicant_Details>
      </Current_Application_Details>
    </Current_Application>
    <SCORE>
      <BureauScore>750</BureauScore>
    </SCORE>
    <CAIS_Account>
      <CAIS_Summary>
        <Credit_Account>
          <CreditAccountTotal>5</CreditAccountTotal>
        </Credit_Account>
      </CAIS_Summary>
    </CAIS_Account>
  </INProfileResponse>
  `;

  beforeAll(async () => {
    // Create temp XML file
    if (!fs.existsSync("./__mocks__")) fs.mkdirSync("./__mocks__");
    fs.writeFileSync("./__mocks__/test.xml", mockXML);
  });

  afterAll(async () => {
    // Cleanup
    if (fs.existsSync("./__mocks__")) fs.rmSync("./__mocks__", { recursive: true });
    await mongoose.connection.close();
  });

  describe("Upload Tests", () => {
    test("POST /api/reports - should reject empty request", async () => {
      const res = await request(app).post("/api/reports");
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/No file uploaded/);
    });

    test("POST /api/reports - should accept valid XML", async () => {
      const res = await request(app)
        .post("/api/reports")
        .attach("xmlFile", "./__mocks__/test.xml");
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("name", "John Doe");
    }, 10000); // Increased timeout
  });

  describe("History Tests", () => {
    test("GET /api/reports - should return report list", async () => {
      const res = await request(app).get("/api/reports");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });
});