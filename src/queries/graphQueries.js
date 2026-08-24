const getPersonSkillsQuery = `
    MATCH (p:Person {id: $personId})
    OPTIONAL MATCH (p)-[r:HAS_SKILL]->(s:Skill)
    RETURN p, 
           collect({
               name: s.name,
               level: r.level
           }) AS skills
`;

const getJobRecommendationsQuery = `
    MATCH (p:Person {id: $personId})
    MATCH (j:Job)-[:REQUIRES]->(s:Skill)
    WITH p, j, collect(s.name) AS requiredSkills

    OPTIONAL MATCH (p)-[:HAS_SKILL]->(personSkill:Skill)
    WITH p, j, requiredSkills, collect(personSkill.name) AS personSkills

    WITH p, j, requiredSkills, personSkills,
         [skill IN requiredSkills WHERE skill IN personSkills] AS matchingSkills

    RETURN
        j.title AS job,
        requiredSkills,
        matchingSkills,
        [skill IN requiredSkills WHERE NOT skill IN personSkills] AS missingSkills,
        CASE
            WHEN size(requiredSkills) = 0 THEN 0
            ELSE toFloat(size(matchingSkills)) / size(requiredSkills) * 100
        END AS matchPercentage
`;
const getPersonTechnologiesQuery = `
    MATCH (p:Person {id: $personId})
          -[:BUILT]->(project:Project)
          -[:USES]->(technology:Technology)

    RETURN
        p.id AS personId,
        p.name AS personName,
        technology.name AS technology,
        technology.category AS category,
        collect(project.name) AS projects
`;
const getPersonGraphQuery = `
    MATCH (p:Person {id: $personId})

    OPTIONAL MATCH (p)-[:HAS_SKILL]->(skill:Skill)

    OPTIONAL MATCH (p)-[:BUILT]->(project:Project)

    OPTIONAL MATCH (project)-[:USES]->(technology:Technology)

    RETURN
        p,
        collect(DISTINCT skill) AS skills,
        collect(DISTINCT project) AS projects,
        collect(DISTINCT technology) AS technologies
`;
module.exports = {
    getPersonSkillsQuery,
    getJobRecommendationsQuery,
    getPersonTechnologiesQuery,
    getPersonGraphQuery
};