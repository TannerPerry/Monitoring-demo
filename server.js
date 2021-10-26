const express = require('express')

const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: 'f27951a1e33a405d8dc15b3eab2a2e9a',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.get('/style', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/styles.css'))
})

let students = []

app.post('/api/student', (req,res ) =>{
    let {name} = req.body
    name = name.trim()
   
    const index = students.findIndex(studentName => studentName === name)

    if (index === -1 && name !== '') {
        students.push(name)
        rollbar.log('student added successfully', {author: 'Tanner', type: 'manual entry'})
        res.status(200).send(students)    
    } else if (name === '') {
    rollbar.error('no name given')
    res.status(400).send('must provide a name')
    } else {
        rollbar.critical('name has already be added')
        res.status(400).send('that student already exists')
    }
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))