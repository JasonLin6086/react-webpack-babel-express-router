import express from 'express';
import router from './routes/index';

let app = express();

app.use('/js', express.static('./dist/public/js'));
app.use('/css', express.static('./dist/public/css'));


app.use('/', router);
app.use('/view/*', router);

app.listen(3000, function () {
	console.log('listening on port 3000!');
});
