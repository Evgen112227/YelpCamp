const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
		useNewUrlParser: true,
	});
}

main()
	.then(() => console.log('Connectio to DB successfull🤪🤪🤪🤪🤪'))
	.catch((error) => console.log(error, '💥💥💥💥💥💥💥💥'));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

// --------------------------------**---------------------------------

app.get('/', (req, res) => {
	res.render('home');
});

app.get(
	'/campgrounds',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.post(
	'/campgrounds',
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.get(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/show', { campground });
	})
);

app.get(
	'/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/edit', { campground });
	})
);

app.put(
	'/campgrounds/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = await Campground.findByIdAndUpdate(req.params.id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.delete(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		res.redirect('/campgrounds');
	})
);

app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
	//достаем переменные из объекта ошибки, созданном с помощью класса ExpressError
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh no, Something went wrong!';
	res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
	console.log('serving on port 3000🎎🎎🎎🎎🎎🎎🎎');
});
