const express = require('express')
const mongoose = require('mongoose')

const config = require('config')
const dotenv = require('dotenv')

const chalk = require('chalk')
const cors = require('cors')

const initDatabase = require('./startUp/initDatabase')
const routes = require('./routes')

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api', routes)

const PORT = process.env.PORT ?? 8080
const mongoUri = process.env.MONGO_URI

// if (process.env.NODE_ENV === 'production') {
// 	console.log('Production')
// } else {
// 	console.log('Development')
// }

async function start() {
	try {
		mongoose.connection.once('open', () => {
			initDatabase()
		})
		await mongoose.connect(mongoUri)
		console.log(chalk.green(`MongoDB connected.`))
		app.listen(PORT, () =>
			console.log(chalk.green(`Server has been started on port ${PORT} ...`))
		)
	} catch (e) {
		console.log(chalk.red(e.message))
		process.exit(1)
	}
}

start()
