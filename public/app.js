const personSelect = document.getElementById("person-select");

const personName = document.getElementById("person-name");
const personRole = document.getElementById("person-role");

const skillCount = document.getElementById("skill-count");
const projectCount = document.getElementById("project-count");
const technologyCount = document.getElementById("technology-count");
const topMatch = document.getElementById("top-match");

const skillsContainer =
    document.getElementById("skills-container");

const technologiesContainer =
    document.getElementById("technologies-container");

const jobsContainer =
    document.getElementById("jobs-container");
const graphContainer =
    document.getElementById("graph-container");

/* =========================
   API HELPER
   ========================= */

async function fetchAPI(endpoint) {

    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    return response.json();
}


/* =========================
   LOAD PERSON DATA
   ========================= */

async function loadPerson(personId) {

    resetUI();

    try {

        const [
            skillsData,
            jobsData,
            technologiesData,
            graphData
        ] = await Promise.all([
            fetchAPI(`/api/people/${personId}/skills`),
            fetchAPI(`/api/people/${personId}/jobs`),
            fetchAPI(`/api/people/${personId}/technologies`),
            fetchAPI(`/api/people/${personId}/graph`)
        ]);

        renderPerson(
            skillsData,
            jobsData,
            technologiesData
        );

        renderSkills(skillsData);

        renderTechnologies(technologiesData);

        renderJobs(jobsData);
renderGraph(graphData);
    } catch (error) {

        console.error("Failed to load dashboard:", error);

        showGlobalError();
    }
}


/* =========================
   PERSON INFORMATION
   ========================= */

function renderPerson(
    skillsData,
    jobsData,
    technologiesData
) {

    const person = skillsData.person;

    personName.textContent =
        person.name || "Unknown person";

    /*
     * Our current skills API returns the person's
     * complete node properties.
     */

    personRole.textContent =
        person.role || "Professional profile";


    const skills =
        skillsData.skills || [];

    const technologies =
        technologiesData.technologies || [];

    const recommendations =
        jobsData.recommendations || [];


    skillCount.textContent =
        skills.length;

    technologyCount.textContent =
        technologies.length;

    /*
     * Technologies are connected to projects.
     * We count unique projects here.
     */

    const projects = new Set();

    technologies.forEach(technology => {

        (technology.projects || []).forEach(project => {
            projects.add(project);
        });

    });

    projectCount.textContent =
        projects.size;


    if (recommendations.length > 0) {

        const bestMatch =
            Math.max(
                ...recommendations.map(
                    job => Number(job.matchPercentage) || 0
                )
            );

        topMatch.textContent =
            `${Math.round(bestMatch)}%`;

    } else {

        topMatch.textContent = "—";
    }
}


/* =========================
   RENDER SKILLS
   ========================= */

function renderSkills(data) {

    const skills =
        data.skills || [];

    if (skills.length === 0) {

        skillsContainer.innerHTML = `
            <div class="empty-state">
                No skills found for this profile.
            </div>
        `;

        return;
    }


    skillsContainer.innerHTML =
        skills.map(skill => {

            return `
                <div class="skill-chip">

                    <span>
                        ${escapeHTML(skill.name)}
                    </span>

                    ${
                        skill.level
                            ? `
                                <span class="skill-level">
                                    ${escapeHTML(skill.level)}
                                </span>
                              `
                            : ""
                    }

                </div>
            `;

        }).join("");
}


/* =========================
   RENDER TECHNOLOGIES
   ========================= */

function renderTechnologies(data) {

    const technologies =
        data.technologies || [];

    if (technologies.length === 0) {

        technologiesContainer.innerHTML = `
            <div class="empty-state">
                No technologies found.
            </div>
        `;

        return;
    }


    technologiesContainer.innerHTML =
        technologies.map(technology => {

            const projects =
                technology.projects || [];

            return `
                <div class="technology-item">

                    <div class="technology-info">

                        <div class="tech-icon">
                            ◇
                        </div>

                        <div>

                            <div class="technology-name">
                                ${escapeHTML(
                                    technology.name
                                )}
                            </div>

                            <div class="technology-category">
                                ${escapeHTML(
                                    technology.category ||
                                    "Technology"
                                )}
                            </div>

                        </div>

                    </div>

                    <span class="project-count">
                        ${projects.length}
                        ${
                            projects.length === 1
                                ? "project"
                                : "projects"
                        }
                    </span>

                </div>
            `;

        }).join("");
}


/* =========================
   RENDER JOBS
   ========================= */

function renderJobs(data) {

    const recommendations =
        data.recommendations || [];


    if (recommendations.length === 0) {

        jobsContainer.innerHTML = `
            <div class="empty-state">
                No job recommendations found.
            </div>
        `;

        return;
    }


    /*
     * Highest match first.
     */

    recommendations.sort(
        (a, b) =>
            Number(b.matchPercentage) -
            Number(a.matchPercentage)
    );


    jobsContainer.innerHTML =
        recommendations.map(job => {

            const percentage =
                Math.round(
                    Number(job.matchPercentage) || 0
                );


            const matchingSkills =
                job.matchingSkills || [];

            const missingSkills =
                job.missingSkills || [];


            return `
                <article class="job-card">

                    <div class="job-header">

                        <div>

                            <div class="job-title">
                                ${escapeHTML(
                                    job.job || "Untitled role"
                                )}
                            </div>

                            <div class="job-company">
                                Graph-based recommendation
                            </div>

                        </div>


                        <div class="match-score">

                            <strong>
                                ${percentage}%
                            </strong>

                            <span>
                                Match
                            </span>

                        </div>

                    </div>


                    <div class="match-bar">

                        <div
                            class="match-fill"
                            style="width: ${percentage}%"
                        ></div>

                    </div>


                    ${
                        matchingSkills.length > 0
                            ? `
                                <div class="skill-section">

                                    <span class="skill-section-label">
                                        Matching skills
                                    </span>

                                    <div class="skill-tags">

                                        ${matchingSkills.map(skill => `
                                            <span class="skill-tag matching">
                                                ✓ ${escapeHTML(skill)}
                                            </span>
                                        `).join("")}

                                    </div>

                                </div>
                              `
                            : ""
                    }


                    ${
                        missingSkills.length > 0
                            ? `
                                <div class="skill-section">

                                    <span class="skill-section-label">
                                        Skills to develop
                                    </span>

                                    <div class="skill-tags">

                                        ${missingSkills.map(skill => `
                                            <span class="skill-tag missing">
                                                + ${escapeHTML(skill)}
                                            </span>
                                        `).join("")}

                                    </div>

                                </div>
                              `
                            : ""
                    }

                </article>
            `;

        }).join("");
}

async function loadPeople() {

    try {

        const people = await fetchAPI("/api/people");

        personSelect.innerHTML = `
            <option value="" disabled>
                Select a person
            </option>
        `;

        people.forEach(person => {

            const option =
                document.createElement("option");

            option.value = person.id;

            option.textContent =
                `${person.name} — ${person.role}`;

            personSelect.appendChild(option);
        });

        // Select Rahul initially
        personSelect.value = "P001";

        await loadPerson("P001");

    } catch (error) {

        console.error(
            "Failed to load people:",
            error
        );

        personSelect.innerHTML = `
            <option value="">
                Unable to load people
            </option>
        `;
    }
}
/* =========================
   RESET UI
   ========================= */

function resetUI() {

    personName.textContent =
        "Loading...";

    personRole.textContent =
        "Loading profile";

    skillCount.textContent =
        "—";

    projectCount.textContent =
        "—";

    technologyCount.textContent =
        "—";

    topMatch.textContent =
        "—";


    skillsContainer.innerHTML = `
        <div class="loading">
            Loading skills...
        </div>
    `;

    technologiesContainer.innerHTML = `
        <div class="loading">
            Loading technologies...
        </div>
    `;

    jobsContainer.innerHTML = `
        <div class="loading">
            Finding opportunities...
        </div>
    `;
}


/* =========================
   ERROR STATE
   ========================= */

function showGlobalError() {

    personName.textContent =
        "Unable to load profile";

    personRole.textContent =
        "Please check the database connection";


    skillsContainer.innerHTML = `
        <div class="error-state">
            Unable to retrieve skills.
        </div>
    `;

    technologiesContainer.innerHTML = `
        <div class="error-state">
            Unable to retrieve technologies.
        </div>
    `;

    jobsContainer.innerHTML = `
        <div class="error-state">
            Unable to retrieve job recommendations.
        </div>
    `;

}


/* =========================
   BASIC HTML ESCAPING
   ========================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   PROFILE SELECTION
   ========================= */

personSelect.addEventListener(
    "change",
    () => {

        loadPerson(
            personSelect.value
        );

    }
);


/* =========================
   INITIAL LOAD
   ========================= */

loadPeople();
function renderGraph(data) {

    graphContainer.innerHTML = "";

    if (!data || !data.nodes || data.nodes.length === 0) {
        graphContainer.innerHTML = `
            <div class="empty-state">
                No graph relationships found.
            </div>
        `;
        return;
    }

    const width = graphContainer.clientWidth || 900;
    const height = graphContainer.clientHeight || 520;

    console.log("Graph width:", width);
    console.log("Graph height:", height);
    console.log("Graph nodes:", data.nodes);
    console.log("Graph relationships:", data.relationships);

    const svg = d3
        .select(graphContainer)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

    /*
     * Give every node an initial position.
     * This guarantees that the nodes are visible
     * even before the force simulation starts.
     */
    const nodes = data.nodes.map((node, index) => ({
        ...node,

        x: width / 2 + Math.cos(index) * 150,
        y: height / 2 + Math.sin(index) * 150
    }));

    const links = data.relationships.map(link => ({
        ...link
    }));

    /*
     * Draw relationships first so that
     * nodes appear above them.
     */
    const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "graph-link")
    .attr("stroke", "#596273")
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.8);
    /*
     * Relationship labels
     */
    const linkLabel = svg
    .append("g")
    .attr("class", "link-labels")
    .selectAll("text")
    .data(links)
    .join("text")
    .attr("class", "graph-edge-label")
    .attr("text-anchor", "middle")
    .attr("fill", "#8b93a3")
    .style("fill", "#8b93a3")
    .style("font-size", "8px")
    .style("font-weight", "500")
    .style("pointer-events", "none")
    .text(d => d.type);
    /*
     * Create node groups.
     */
    const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "graph-node")
    .style("cursor", "pointer")
    .on("click", function (event, d) {
        console.log("Selected node:", d);
    });
    /*
     * Draw node circles.
     */
    node
        .append("circle")
        .attr("r", d => {

            if (d.type === "Person") {
                return 25;
            }

            if (d.type === "Project") {
                return 21;
            }

            return 17;
        })
        .attr("fill", d => {

            if (d.type === "Person") {
                return "#8b7cff";
            }

            if (d.type === "Skill") {
                return "#4ade80";
            }

            if (d.type === "Project") {
                return "#fbbf24";
            }

            if (d.type === "Technology") {
                return "#60a5fa";
            }

            return "#8d93a1";
        });

    /*
     * Node names
     */
   node
    .append("text")
    .attr("class", "graph-node-title")
    .attr("text-anchor", "middle")
    .attr("dy", 34)
    .style("fill", "#ffffff", "important")
    .style("color", "#ffffff", "important")
    .style("font-size", "11px", "important")
    .style("font-weight", "600", "important")
    .style("pointer-events", "none")
    .text(d => d.label);
    /*
     * Node types
     */
   node
    .append("text")
    .attr("class", "graph-node-label")
    .attr("text-anchor", "middle")
    .attr("dy", 47)
    .attr("fill", "#9ca3af")
    .style("fill", "#9ca3af")
    .style("font-size", "9px")
    .style("font-weight", "500")
    .style("pointer-events", "none")
    .text(d => d.type);

    /*
     * Create force simulation.
     */
    const simulation = d3
        .forceSimulation(nodes)

        .force(
            "link",
            d3
                .forceLink(links)
                .id(d => d.id)
                .distance(150)
        )

        .force(
            "charge",
            d3
                .forceManyBody()
                .strength(-400)
        )

        .force(
            "center",
            d3.forceCenter(
                width / 2,
                height / 2
            )
        )

        .force(
            "collision",
            d3.forceCollide(50)
        );

    /*
     * Update the graph every simulation tick.
     */
    simulation.on("tick", () => {

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        linkLabel
            .attr(
                "x",
                d => (d.source.x + d.target.x) / 2
            )
            .attr(
                "y",
                d => (d.source.y + d.target.y) / 2
            );

        node.attr(
            "transform",
            d => `translate(${d.x},${d.y})`
        );
    });

    /*
     * Allow nodes to be dragged.
     */
    node.call(
        d3
            .drag()

            .on("start", (event, d) => {

                if (!event.active) {
                    simulation.alphaTarget(0.3).restart();
                }

                d.fx = d.x;
                d.fy = d.y;
            })

            .on("drag", (event, d) => {

                d.fx = event.x;
                d.fy = event.y;
            })

            .on("end", (event, d) => {

                if (!event.active) {
                    simulation.alphaTarget(0);
                }

                d.fx = null;
                d.fy = null;
            })
    );

    /*
     * Legend
     */
    const legend =
        document.createElement("div");

    legend.className = "graph-legend";

    legend.innerHTML = `
    <div class="legend-item">
        <span class="legend-dot person-dot"></span>
        <span>Person</span>
    </div>

    <div class="legend-item">
        <span class="legend-dot skill-dot"></span>
        <span>Skill</span>
    </div>

    <div class="legend-item">
        <span class="legend-dot project-dot"></span>
        <span>Project</span>
    </div>

    <div class="legend-item">
        <span class="legend-dot technology-dot"></span>
        <span>Technology</span>
    </div>
`;

    graphContainer.appendChild(legend);
}