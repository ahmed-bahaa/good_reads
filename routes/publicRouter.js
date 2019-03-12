//===================== AUTHORS =========================

// lists authors
admin_router.get('/authors/', async (req, res) => {
    try {
        const authors = await author_model.find({});
        res.json({
            status: "failure",
            data: authors
        });
    }
    catch (e) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//get specific author
admin_router.get('/authors/:id', async (req, res) => {
    try {
        const selected_author = await author_model.findById(req.params.id.replace(":", ""));
        res.json({
            status: "failure",
            data: selected_author
        });
    }
    catch (e) {
        res.json({
            status: "failure",
            data: err
        });
    }
})