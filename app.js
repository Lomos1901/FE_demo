import express from 'express';
import gsmarena from 'gsmarena-api';
import axios from 'axios';

const app = express();
const port = 4000;

app.use(express.json());

// Ghi đè axiosInstance với headers giả lập browser
gsmarena.axiosInstance = axios.create({
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/118.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
    },
});

// Hàm random delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function randomDelay(min = 1500, max = 4000) {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`Delay: ${time} ms`);
    await sleep(time);
}

app.get('/', async (req, res) => {
    try {
        await randomDelay();
        const devices = await gsmarena.search.search('samsung a9 2018');
        const devicesId = devices.map(device => device.id);

        await randomDelay();
        const detailedDevices = await gsmarena.catalog.getDevice(devicesId[0]);

        res.json(detailedDevices);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching devices');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
