import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/+esm';

class Sheter {
    constructor(id, descr, street) {
        this.id = id;
        this.descr = descr;
        this.street = street;
    }
}

function redirect(st, des) {
    window.location.href = 'https://www.google.com/maps/dir/' + st + '/' + des;
}

document.getElementById('button1').addEventListener('click', async () => {
    try {
        const location = await getLocation();
        if (location) {
            let shelters = await sendDistance(location);
            shelters.sort((a, b) => a.Distance - b.Distance);
            let dist1;
            let dist = shelters.map(a => a.Distance);
            for (let i = 0; i < dist.length; i++) {   
                if (dist[i] < 1000) {
                    dist1 = '\u0414\u0438\u0441\u0442\u0430\u043d\u0446\u0456\u044f: ' + Math.round(dist[i]) + '\u043c'; 
                } else {
                    dist1 = '\u0414\u0438\u0441\u0442\u0430\u043d\u0446\u0456\u044f: ' + Math.round(dist[i] / 1000) + ' \u043a\u043c';
                }
                console.log(dist1);
                document.getElementById('go' + i).setAttribute('style', 'white-space: pre;');
                document.getElementById('go' + i).textContent = shelters[i].Description + ' (' + shelters[i].Street + ')\r\n';
                document.getElementById('go' + i).textContent += dist1;
                document.getElementById('go' + i).style.color = "Black";
                document.getElementById('go' + i).addEventListener('click', async () => { redirect(location, shelters[i].ShelterLocation); });
            }
        }
    } catch (error) {
        console.error(error);
    }
});

let latitude;
let longitude;

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    const locationString = `${latitude}, ${longitude}`;
                    closePopups();
                    showContainers();
                    resolve(locationString);
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            reject(new Error('Geolocation is not supported'));
        }
    });
}

function closePopups() {
    var popup = document.querySelector('.popup');
    var manualWindow = document.getElementById('manualWindow');
    popup.style.display = 'none';
    manualWindow.style.display = 'none';
}

function showContainers() {
    var containerWrapper = document.getElementById('container-wrapper');
    containerWrapper.style.display = 'flex';
}

const getRowsFromDatabase = async () => {
    try {
        const response = await axios.get('https://fys.pp.ua/api/fysShelter');
        console.log(response.data);
        shelters = response.data;
    } catch (error) {
        console.error(error);
    }
};

const sendDistance = async (data) => {
    try {
        const response = await axios.post('https://fys.pp.ua/api/sendloc', { location: data });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
    }
};