const express = require("express");
const graphRoutes = require("./routes/graphRoutes");
console.log("graphRoutes loaded:", typeof graphRoutes);

const app = express();

app.use(express.json());
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "../public")));
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Wexa Graph API is running"
    });
});

app.use("/api", graphRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});