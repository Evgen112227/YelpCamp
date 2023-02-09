const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHeplers');

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
		useNewUrlParser: true,
	});
}

main()
	.then(() => console.log('Connection to DB from SEED!!! successfull🤪🤪🤪🤪🤪'))
	.catch((error) => console.log(error, '💥💥💥💥💥💥💥💥'));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
	console.log('Connection to DB from SEED!!! CLOSED');
});
