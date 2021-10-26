const express = require('express')

const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: 'f27951a1e33a405d8dc15b3eab2a2e9a',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})


let students = []

app.post('/api/student', (req,res ) =>{
    const { name } = req.body
    name = name.trim()
    students.push(name)
    rollbar.log('student added successfully', {author: 'Tanner', type: 'manual entry'})
    res.status(200).send(students)

})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))