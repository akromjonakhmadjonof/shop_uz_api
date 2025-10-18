// Imports
const express = require('express');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET'],
	optionsSuccessStatus:200
}));

// Apis
router.get('/public/uploads/images/:image', (req, res) => {
	const {
		image
	} = req.params;
	const options = {
		root:path.join(__dirname)
	};
	res.sendFile(`./public/uploads/images/${image}`, options);
});

// Set The Storage Engine
const storage = multer.diskStorage({
	destination:'public/uploads/images',
	filename:function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

// Init Upload
const uploadImage = multer({
	storage:storage,
	limits:{ fileSize:1000000 },
	fileFilter:function (req, file, cb) {
		checkFileType(file, cb);
	}
}).single('image');
sharp.cache(false);

// Check File Type
function checkFileType (file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb('Error: Images Only!');
	}
}

router.post('/main/image-upload/', (req, res) => {
	uploadImage(req, res, async (err) => {
		if (err) {
			res.send([
				'an error'
			]);
		} else {
			if (req.file === undefined) {
				res.status(400);
				res.send([
					'file not uploaded'
				]);
			} else {
				await sharp(path.resolve('public/uploads/images', req.file.filename)).resize({width: 1080, height: 1080}).toFile('./public/uploads/instagram/' + req.file.filename)
				res.send({
					message:'Successful uploaded',
					file_name:req.file.filename,
					src:`http://localhost:9998/public/uploads/images/${req.file.filename}`
				});
			}
		}
	});
});

module.exports = router;
