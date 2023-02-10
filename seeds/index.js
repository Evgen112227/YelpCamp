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
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image:
				'https://images.unsplash.com/photo-1483354483454-4cd359948304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY3NjAyNDg2Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
			description: 'lorem 1 2 3 4 5 lorem ha a ha a 5 4 3 2 1 lorem',
			price: price,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
	console.log('Connection to DB from SEED!!! CLOSED');
});
