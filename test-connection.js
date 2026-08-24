const driver = require("./src/database");

async function testConnection() {
    const session = driver.session();

    try {
        const result = await session.run("RETURN 1 AS number");

        console.log("Connected to CognoDB!");
console.log(result.records[0].get("number").toNumber());    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
    } finally {
        await session.close();
        await driver.close();
    }
}

testConnection();