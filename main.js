const time = new Date();
const month = time.getMonth();
const date = time.getDate();
const day = time.getDay();

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение']
const daysTranslate = {'Sunday':'Воскресение', 'Monday':'Понедельник', 'Tuesday':'Вторник', 'Wednesday':'Среда', 'Thursday':'Четверг', 'Friday':'Пятница', 'Saturday':'Суббота'}
const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

const element = document.querySelector('.currentDay')
const currentDayWeatherInfo = document.querySelector('.info')
const currentDayWeatherMoreInfo = document.querySelector('.more_info')
const areaSelect = document.querySelector('select')
const futureDaysWeather = document.querySelector('.predict')
const dayInfo = document.querySelector('h3')

element.style.display = 'none'

fetch('https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json')
    .then(res => res.json())
    .then((out) => {
        const cities = new Store(transformData(out))
        addCitiesToSelect(cities)
        getWeatherForSelectedCity(cities)
    }).catch(err => console.error(err))

function transformData(arr) {
    const newData = []
    arr[0].regions.forEach(item => item.cities.forEach(value => newData.push(value)))
    return newData.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
}

function addCitiesToSelect(cities) {
    cities.getAllCities().forEach((city) => {
        const list = document.querySelector('select')
        const row = document.createElement('option')
        row.innerText = city.name
        list.appendChild(row)
    })
}

function getWeatherForSelectedCity(cities) {
    areaSelect.addEventListener('change', (e) => {
        const name = e.target.value
        const {lat, lng} = cities.getCity(name)
        getWeather(lat, lng)
    })
}


function getWeather(lat, lng) {
    const apiKey = "ced41939503559b636afba990d7e804a"
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,minutely&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            dayInfo.innerHTML = days[day - 1] + ', ' + date+ ' ' + months[month]
            element.style.display = 'flex'
            showWeather(data)
        }).catch(err => console.error(err))
}

function showWeather(data) {
    const {humidity, pressure, wind_speed, sunrise, sunset} = data.current;

    currentDayWeatherMoreInfo.innerHTML =
        `
        <div class="more_info__item">
            <div>Влажность</div>
            <div>${humidity}%</div>
        </div>
        <div class="more_info__item">
            <div>Давление</div>
            <div>${pressure}</div>
        </div>
        <div class="more_info__item">
            <div>Скорость Ветра</div>
            <div>${wind_speed}</div>
        </div>
        <div class="more_info__item">
        <div>Восход </div>
        <div>${window.moment(sunrise * 1000).format('HH:mm')}</div>
    </div>
    <div class="more_info__item">
        <div>Закат</div>
        <div>${window.moment(sunset*1000).format('HH:mm')}</div>
    </div>
        `

    let futureDays = ''
    data.daily.forEach((day, idx) => {
        if (idx === 0) {
            currentDayWeatherInfo.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div>
                <div>Ночь - ${day.temp.night}&#176;C</div>
                <div>День - ${day.temp.day}&#176;C</div>
            </div>
            `
        } else {
            futureDays += `
            <div class="predict__card">
                <div class="predict__day">${daysTranslate[window.moment(day.dt*1000).format('dddd')]}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="predict__temp">Ночь - ${day.temp.night}&#176;C</div>
                <div class="predict__temp">День - ${day.temp.day}&#176;C</div>
            </div>
            `
        }
    })
    futureDaysWeather.innerHTML = futureDays;
}




