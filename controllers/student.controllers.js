const { connection } = require("../util/database");

const addStudent = (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                message: 'all fields are required !'
            })
        }

        const query = `insert into students(
            name,
            email
        ) values(?, ?)`

        connection.execute(query, [name, email], (err) => {
            if (err) {
                console.log(err.message);
                connection.end();
                res.status(500).json(
                    {
                        error: err.message
                    }
                )
                return;
            }
            console.log('value has been inserted');
            res.status(201).json(
                {
                    message: `student added successfully with ${name}`
                }
            )
        })

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}
const getStudent = (req, res) => {
    try {
        const query = `select * from students;`;

        connection.query(query, (err, result) => {
            if (err) {
                console.log(err.message);
                connection.end();
                res.status(500).json(
                    {
                        error: err.message
                    }
                )
                return;
            }
            res.status(201).json(
                result
            )
        })

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

module.exports = {
    addStudent,
    getStudent,
}