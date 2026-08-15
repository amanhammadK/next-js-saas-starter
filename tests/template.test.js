import { NextJsSaasStarterServer } from "../src/mcpServer.js";

describe("NextJsSaasStarterServer", () => {
    let server;

    beforeEach(() => {
        server = new NextJsSaasStarterServer();
    });

    test("should initialize server", () => {
        expect(server).toBeDefined();
        expect(server.server).toBeDefined();
    });
});
