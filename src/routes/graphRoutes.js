const express = require("express");
const driver = require("../database");
const { getPersonSkillsQuery,getJobRecommendationsQuery,
    getPersonTechnologiesQuery,getPersonGraphQuery} = require("../queries/graphQueries");

const router = express.Router();


router.get("/people/:personId/skills", async (req, res) => {
    const { personId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            getPersonSkillsQuery,
            { personId }
        );

        if (result.records.length === 0) {
            return res.status(404).json({
                error: "Person not found"
            });
        }

        const record = result.records[0];

        const person = record.get("p").properties;
        const skills = record.get("skills");

        res.json({
            person,
            skills
        });

    } catch (error) {
        console.error("Database query failed:", error.message);

        res.status(503).json({
            error: "Unable to connect to graph database"
        });

    } finally {
        await session.close();
    }
});
router.get("/people/:personId/jobs", async (req, res) => {
    const { personId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            getJobRecommendationsQuery,
            { personId }
        );

        const recommendations = result.records.map(record => ({
            job: record.get("job"),
            requiredSkills: record.get("requiredSkills"),
            matchingSkills: record.get("matchingSkills"),
            missingSkills: record.get("missingSkills"),
            matchPercentage: record.get("matchPercentage")
        }));

        res.json({
            personId,
            recommendations
        });

    } catch (error) {
        console.error(
            "Job recommendation query failed:",
            error.message
        );

        res.status(503).json({
            error: "Unable to retrieve job recommendations"
        });

    } finally {
        await session.close();
    }
});
router.get("/people/:personId/technologies", async (req, res) => {
    const { personId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            getPersonTechnologiesQuery,
            { personId }
        );

        if (result.records.length === 0) {
            return res.status(404).json({
                error: "Person or project relationships not found"
            });
        }

        const technologies = result.records.map(record => ({
            name: record.get("technology"),
            category: record.get("category"),
            projects: record.get("projects")
        }));

        res.json({
            person: {
                id: result.records[0].get("personId"),
                name: result.records[0].get("personName")
            },
            technologies
        });

    } catch (error) {
        console.error(
            "Technology query failed:",
            error.message
        );

        res.status(503).json({
            error: "Unable to retrieve technologies"
        });

    } finally {
        await session.close();
    }
});
router.get("/people", async (req, res) => {
    const session = driver.session();

    try {
        const result = await session.run(`
            MATCH (p:Person)
            RETURN p.id AS id, p.name AS name, p.role AS role
            ORDER BY p.name
        `);

        const people = result.records.map(record => ({
            id: record.get("id"),
            name: record.get("name"),
            role: record.get("role")
        }));

        res.json(people);

    } catch (error) {
        console.error(
            "Failed to retrieve people:",
            error.message
        );

        res.status(503).json({
            error: "Unable to retrieve people"
        });

    } finally {
        await session.close();
    }
});
router.get("/people/:personId/graph", async (req, res) => {
    const { personId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            getPersonGraphQuery,
            { personId }
        );

        if (result.records.length === 0) {
            return res.status(404).json({
                error: "Person not found"
            });
        }

        const record = result.records[0];

        const person = record.get("p");
        const skills = record.get("skills");
        const projects = record.get("projects");
        const technologies = record.get("technologies");

        const nodes = [];
        const relationships = [];

        /*
         * Add the person node
         */
        nodes.push({
            id: person.elementId,
            label: person.properties.name,
            type: "Person"
        });

        /*
         * Add skill nodes and
         * Person -> Skill relationships
         */
        for (const skill of skills) {

            if (!skill) continue;

            nodes.push({
                id: skill.elementId,
                label: skill.properties.name,
                type: "Skill"
            });

            relationships.push({
                source: person.elementId,
                target: skill.elementId,
                type: "HAS_SKILL"
            });
        }

        /*
         * Add project nodes and
         * Person -> Project relationships
         */
        for (const project of projects) {

            if (!project) continue;

            nodes.push({
                id: project.elementId,
                label: project.properties.name,
                type: "Project"
            });

            relationships.push({
                source: person.elementId,
                target: project.elementId,
                type: "BUILT"
            });
        }

        /*
         * Add technology nodes and
         * Project -> Technology relationships
         */
        for (const technology of technologies) {

            if (!technology) continue;

            nodes.push({
                id: technology.elementId,
                label: technology.properties.name,
                type: "Technology"
            });

            /*
             * Connect the technology to the projects
             * that use it.
             */
            for (const project of projects) {

                if (!project) continue;

                /*
                 * We know from our seed model that
                 * these technologies are connected
                 * through USES relationships.
                 *
                 * The frontend graph will use the
                 * returned project/technology structure.
                 */
                relationships.push({
                    source: project.elementId,
                    target: technology.elementId,
                    type: "USES"
                });
            }
        }

        res.json({
            nodes,
            relationships
        });

    } catch (error) {

        console.error(
            "Graph query failed:",
            error.message
        );

        res.status(503).json({
            error: "Unable to retrieve graph"
        });

    } finally {
        await session.close();
    }
});
module.exports = router;