const driver = require("../src/database");

async function seed() {
    const session = driver.session();

    try {
        console.log("Starting database seed...");

        // Data will be added here
        const people = [
    {
        id: "P001",
        name: "Rahul Sharma",
        role: "Backend Developer"
    },
    {
        id: "P002",
        name: "Ananya Rao",
        role: "Full Stack Developer"
    },
    {
        id: "P003",
        name: "Arjun Mehta",
        role: "Data Engineer"
    },
    {
        id: "P004",
        name: "Sneha Reddy",
        role: "Frontend Developer"
    }
];

await session.run(
    `
    UNWIND $people AS person
    MERGE (p:Person {id: person.id})
    SET p.name = person.name,
        p.role = person.role
    `,
    { people }
);

console.log("People seeded.");
const skills = [
    { id: "S001", name: "JavaScript", category: "Programming" },
    { id: "S002", name: "Node.js", category: "Backend" },
    { id: "S003", name: "React", category: "Frontend" },
    { id: "S004", name: "Python", category: "Programming" },
    { id: "S005", name: "PostgreSQL", category: "Database" },
    { id: "S006", name: "MongoDB", category: "Database" },
    { id: "S007", name: "Docker", category: "DevOps" },
    { id: "S008", name: "REST APIs", category: "Backend" },
    { id: "S009", name: "Machine Learning", category: "AI" },
    { id: "S010", name: "Git", category: "Tools" }
];

await session.run(
    `
    UNWIND $skills AS skill
    MERGE (s:Skill {id: skill.id})
    SET s.name = skill.name,
        s.category = skill.category
    `,
    { skills }
);

console.log("Skills seeded.");
const technologies = [
    { id: "T001", name: "Node.js", category: "Runtime" },
    { id: "T002", name: "React", category: "Framework" },
    { id: "T003", name: "PostgreSQL", category: "Database" },
    { id: "T004", name: "MongoDB", category: "Database" },
    { id: "T005", name: "Docker", category: "DevOps" },
    { id: "T006", name: "Python", category: "Programming" }
];

await session.run(
    `
    UNWIND $technologies AS technology
    MERGE (t:Technology {id: technology.id})
    SET t.name = technology.name,
        t.category = technology.category
    `,
    { technologies }
);

console.log("Technologies seeded.");
const projects = [
    {
        id: "PR001",
        name: "Secure Chat Application",
        description: "Real-time chat application with end-to-end encryption."
    },
    {
        id: "PR002",
        name: "E-Commerce Platform",
        description: "Full-stack platform for browsing and purchasing products."
    },
    {
        id: "PR003",
        name: "Data Analytics Pipeline",
        description: "Pipeline for processing and analyzing structured datasets."
    },
    {
        id: "PR004",
        name: "AI Recommendation Engine",
        description: "Recommendation system using machine learning techniques."
    }
];

await session.run(
    `
    UNWIND $projects AS project
    MERGE (p:Project {id: project.id})
    SET p.name = project.name,
        p.description = project.description
    `,
    { projects }
);

console.log("Projects seeded.");
const companies = [
    {
        id: "C001",
        name: "Wexa AI",
        industry: "Artificial Intelligence"
    },
    {
        id: "C002",
        name: "TechNova",
        industry: "Software"
    },
    {
        id: "C003",
        name: "DataSphere",
        industry: "Data Engineering"
    }
];

await session.run(
    `
    UNWIND $companies AS company
    MERGE (c:Company {id: company.id})
    SET c.name = company.name,
        c.industry = company.industry
    `,
    { companies }
);

console.log("Companies seeded.");
const jobs = [
    {
        id: "J001",
        title: "Backend Engineer",
        location: "Hyderabad",
        type: "Full-time"
    },
    {
        id: "J002",
        title: "Full Stack Developer",
        location: "Bangalore",
        type: "Full-time"
    },
    {
        id: "J003",
        title: "Data Engineer",
        location: "Pune",
        type: "Full-time"
    },
    {
        id: "J004",
        title: "ML Engineer",
        location: "Remote",
        type: "Full-time"
    }
];

await session.run(
    `
    UNWIND $jobs AS job
    MERGE (j:Job {id: job.id})
    SET j.title = job.title,
        j.location = job.location,
        j.type = job.type
    `,
    { jobs }
);

console.log("Jobs seeded.");
const personSkills = [
    { personId: "P001", skillId: "S001", level: "Advanced" },
    { personId: "P001", skillId: "S002", level: "Advanced" },
    { personId: "P001", skillId: "S005", level: "Intermediate" },
    { personId: "P001", skillId: "S008", level: "Advanced" },
    { personId: "P001", skillId: "S010", level: "Advanced" },

    { personId: "P002", skillId: "S001", level: "Advanced" },
    { personId: "P002", skillId: "S002", level: "Intermediate" },
    { personId: "P002", skillId: "S003", level: "Advanced" },
    { personId: "P002", skillId: "S006", level: "Intermediate" },
    { personId: "P002", skillId: "S010", level: "Advanced" },

    { personId: "P003", skillId: "S004", level: "Advanced" },
    { personId: "P003", skillId: "S005", level: "Advanced" },
    { personId: "P003", skillId: "S007", level: "Intermediate" },
    { personId: "P003", skillId: "S009", level: "Advanced" },

    { personId: "P004", skillId: "S001", level: "Advanced" },
    { personId: "P004", skillId: "S003", level: "Advanced" },
    { personId: "P004", skillId: "S006", level: "Intermediate" },
    { personId: "P004", skillId: "S010", level: "Advanced" }
];

await session.run(
    `
    UNWIND $personSkills AS item
    MATCH (p:Person {id: item.personId})
    MATCH (s:Skill {id: item.skillId})
    MERGE (p)-[r:HAS_SKILL]->(s)
    SET r.level = item.level
    `,
    { personSkills }
);

console.log("Person-skill relationships seeded.");
const personProjects = [
    { personId: "P001", projectId: "PR001" },
    { personId: "P002", projectId: "PR002" },
    { personId: "P003", projectId: "PR003" },
    { personId: "P003", projectId: "PR004" },
    { personId: "P004", projectId: "PR002" }
];

await session.run(
    `
    UNWIND $personProjects AS item
    MATCH (p:Person {id: item.personId})
    MATCH (project:Project {id: item.projectId})
    MERGE (p)-[:BUILT]->(project)
    `,
    { personProjects }
);

console.log("Person-project relationships seeded.");
const projectTechnologies = [
    { projectId: "PR001", technologyId: "T001" },
    { projectId: "PR001", technologyId: "T003" },
    { projectId: "PR001", technologyId: "T005" },

    { projectId: "PR002", technologyId: "T001" },
    { projectId: "PR002", technologyId: "T002" },
    { projectId: "PR002", technologyId: "T004" },

    { projectId: "PR003", technologyId: "T006" },
    { projectId: "PR003", technologyId: "T003" },
    { projectId: "PR003", technologyId: "T005" },

    { projectId: "PR004", technologyId: "T006" }
];

await session.run(
    `
    UNWIND $projectTechnologies AS item
    MATCH (project:Project {id: item.projectId})
    MATCH (technology:Technology {id: item.technologyId})
    MERGE (project)-[:USES]->(technology)
    `,
    { projectTechnologies }
);

console.log("Project-technology relationships seeded.");
const jobSkills = [
    { jobId: "J001", skillId: "S001", importance: "Required" },
    { jobId: "J001", skillId: "S002", importance: "Required" },
    { jobId: "J001", skillId: "S005", importance: "Required" },
    { jobId: "J001", skillId: "S008", importance: "Required" },
    { jobId: "J001", skillId: "S007", importance: "Preferred" },

    { jobId: "J002", skillId: "S001", importance: "Required" },
    { jobId: "J002", skillId: "S002", importance: "Required" },
    { jobId: "J002", skillId: "S003", importance: "Required" },
    { jobId: "J002", skillId: "S006", importance: "Preferred" },

    { jobId: "J003", skillId: "S004", importance: "Required" },
    { jobId: "J003", skillId: "S005", importance: "Required" },
    { jobId: "J003", skillId: "S007", importance: "Preferred" },

    { jobId: "J004", skillId: "S004", importance: "Required" },
    { jobId: "J004", skillId: "S009", importance: "Required" },
    { jobId: "J004", skillId: "S007", importance: "Preferred" }
];

await session.run(
    `
    UNWIND $jobSkills AS item
    MATCH (j:Job {id: item.jobId})
    MATCH (s:Skill {id: item.skillId})
    MERGE (j)-[r:REQUIRES]->(s)
    SET r.importance = item.importance
    `,
    { jobSkills }
);

console.log("Job-skill relationships seeded.");
const jobCompanies = [
    { jobId: "J001", companyId: "C001" },
    { jobId: "J002", companyId: "C002" },
    { jobId: "J003", companyId: "C003" },
    { jobId: "J004", companyId: "C001" }
];

await session.run(
    `
    UNWIND $jobCompanies AS item
    MATCH (j:Job {id: item.jobId})
    MATCH (c:Company {id: item.companyId})
    MERGE (j)-[:AT]->(c)
    `,
    { jobCompanies }
);

console.log("Job-company relationships seeded.");

        console.log("Database seed completed successfully.");
    } catch (error) {
        console.error("Seeding failed:", error.message);
    } finally {
        await session.close();
        await driver.close();
    }
}

seed();