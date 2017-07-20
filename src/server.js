import express from 'express';
import router from './routes/index';

let app = express();

app.use('/public', express.static('./dist/public'));


app.use('/', router);
app.use('/view/*', router);

app.listen(3000, function () {
	console.log('listening on port 3000!');
});
