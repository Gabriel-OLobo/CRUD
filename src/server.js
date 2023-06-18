const express = require('express');
const bodyParser = require('body-parser');
const programmer = require('./database/tables/progammer');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.get('/syncDatabase', async (req, res) => {
    const database = require('./database/db');

    try{
        await database.sync();

        res.send('Database successfully sync');
    } catch (error) {
        res.send(error);
    }
});

app.post('/createProgrammer', async (req, res) => {
    try {
        const params = req.body;

        const properties = ['name', 'javascript', 'java', 'python'];

        const check = properties.every((property) => {
            return property in params;
        });

        if(!check) {
            const propStr = properties.join(', ');
            res.send(`All parameters needed to create a programmer must be sent ${propStr}`);
            return;
        }

        const newProgrammer = await programmer.create({
            name: params.name,
            javascript: params.javascript,
            java: params.java,
            python: params.python
        })

        res.send(newProgrammer);

    } catch (error) {
        res.send(error);
    }
})

app.listen(port, () => {
    console.log(`Now Listening on port ${port}`);
});

app.get('/retrieverProgrammer', async (req, res) => {
    try {
        const params = req.body;
        if ('id' in params) {
            const record = await programmer.findByPk(params.id);

            if (record) {
                res.send(record);
            } else {
                res.send('No programmer found using received ID');
            }

            return;
        }

        const records = await programmer.findAll();
        res.send(records);

    } catch (error) {
        res.send(error);
    }
});

app.put('/updateProgrammer', async(req, res) =>{
    try {
        const params = req.body;

        if (!('id' in params)) {
            res.send('Missing "id" in request body. ')
            return;
        }

        const record = await programmer.findByPk(params.id);

        if(!record){
            res.send(`Programmer id not found.`);
            return;
        }

        const properties = ['name','python','java','javascript'];

        const check = properties.some((property) => {
            return property in params;
        });

        record.name = params.name || record.name;
        record.python = params.python || record.python;
        record.java = params.java || record.java;
        record.javascript = params.javascript;

        await record.save;

        res.send(`${record.id} ${record.name} - Updated successfully`);

    } catch (error) {
        res.send(error);
    }
});

app.delete('/deleteProgrammer', async(req, res) => {
    try {
        const params = req.body;
if (!('id' in params)) {
    req.send('Missing "id" in request body.');
    return;
}

    await record.destroy();

    res.send(`${record.id} ${record.name} - Deleted successfully.`);

    } catch (error) {
        res.send(error);
    }
})