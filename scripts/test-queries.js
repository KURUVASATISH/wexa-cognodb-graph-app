const driver = require("../src/database");

async function runQueries() {
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (p:Person {id: $personId})
                  -[:BUILT]->
                  (project:Project)
                  -[:USES]->
                  (technology:Technology)
            RETURN project.name AS project,
                   technology.name AS technology
            `,
            {
                personId: "P001"
            }
        );

        for (const record of result.records) {
            console.log({
                project: record.get("project"),
                technology: record.get("technology")
            });
        }

    } catch (error) {
        console.error("Query failed:", error.message);
    } finally {
        await session.close();
        await driver.close();
    }
}

runQueries();