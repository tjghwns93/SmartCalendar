import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Home from './routes/Home';
import Detail from './routes/Detail';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const nowMonth = String(nowDate.getMonth() + 1).padStart(2, '0');
    const nowDay = String(nowDate.getDate()).padStart(2, '0');
    const [clickedDate, setClickedDate] = useState(`${nowYear}${nowMonth}${nowDay}`);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loadedMonths, setLoadedMonths] = useState([]);
    const [viewYear, setViewYear] = useState(currentYear);
    const [view, setView] = useState(false);
    const navigate = useNavigate();
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState('Seoul,KR');
    const [selected, setSelected] = useState('서울');
    const weatherImages = {
        Clear: 'https://github.com/tjghwns93/calendar-images/blob/main/sun.png?raw=true',
        Clouds: 'https://github.com/tjghwns93/calendar-images/blob/main/cloud%20icon.png?raw=true',
        Rain: 'https://github.com/tjghwns93/calendar-images/blob/main/rain%20icon.png?raw=true',
        Drizzle: 'https://github.com/tjghwns93/calendar-images/blob/main/rain%20icon.png?raw=true',
        Thunderstorm: 'https://github.com/tjghwns93/calendar-images/blob/main/thunderstorm%20icon.png?raw=true',
        Snow: 'https://github.com/tjghwns93/calendar-images/blob/main/snow%20icon.png?raw=true',
        Mist: 'https://github.com/tjghwns93/calendar-images/blob/main/cloudAndSun.png?raw=true',
        Smoke: 'https://github.com/tjghwns93/calendar-images/blob/main/cloudAndSun.png?raw=true',
        Haze: 'https://github.com/tjghwns93/calendar-images/blob/main/cloudAndSun.png?raw=true',
        Dust: 'https://github.com/tjghwns93/calendar-images/blob/main/cloudAndSun.png?raw=true',
        Fog: 'https://github.com/tjghwns93/calendar-images/blob/main/cloud%20icon.png?raw=true',
        Sand: 'https://github.com/tjghwns93/calendar-images/blob/main/cloudAndSun.png?raw=true',
        Ash: 'https://github.com/tjghwns93/calendar-images/blob/main/cloud%20icon.png?raw=true',
        Squall: 'https://github.com/tjghwns93/calendar-images/blob/main/wind%20icon.png?raw=true',
        Tornado: 'https://github.com/tjghwns93/calendar-images/blob/main/wind%20icon.png?raw=true'
    };
    
    
    useEffect(() => {
        const fetchWeather = async () => {
            const API_KEY = '5c4d595a2dfb489c402ff81d7600ce30'; // 발급받은 API 키
            const CITY = selectedArea; // 한국의 도시 이름
            const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`;
            
            try {
                const response = await axios.get(URL);
                setForecastData(response.data.list);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        
        fetchWeather();
    }, [selectedArea]);

    
    useEffect(() => {
        if (localStorage.getItem('info') === null) {
            localStorage.setItem('info', JSON.stringify([]));
        }
    }, []);
    
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                loadNextMonth();
            }
            
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentMonth, currentYear]);
    
    const loadNextMonth = () => {
        setCurrentMonth(prevMonth => {
            let newMonth = prevMonth + 1;
            let newYear = currentYear;
            
            if (newMonth > 11) {
                newMonth = 0;
                newYear += 1;
                setCurrentYear(newYear);
            }
            
            setLoadedMonths(prevLoadedMonths => [...prevLoadedMonths, { month: newMonth, year: newYear }]);
            return newMonth;
        });
    };
    
    useEffect(() => {
        setLoadedMonths([{ month: currentMonth, year: currentYear }]);
    }, []);
    
    const buildCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = Array.from({ length: lastDay.getDate() }, (_, i) => {
            const day = new Date(year, month, i + 1);
            return {
                date: i + 1,
                dayOfWeek: day.getDay(), // 요일 계산 (0: 일요일, 6: 토요일)
            };
        });
        const firstDayIndex = (firstDay.getDay() + 6) % 7;
        const emptyDays = Array(firstDayIndex).fill(null);
        
        return { daysInMonth, emptyDays };
    };
    
    useEffect(() => {
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const rect = entry.target.getBoundingClientRect();
                const entryTop = rect.top;
                const entryBottom = rect.bottom;
                if (entry.isIntersecting) {
                    if(entryBottom + entryTop < window.innerHeight){
                        setViewYear(prevYear => prevYear - 1);
                    }
                }else if(entryTop < 0 && entryTop > -100 && entryBottom > 0 && entryTop + entryBottom > 0){
                    setViewYear(prevYear => prevYear + 1);
                }
            });
        }, {
            root: null,
            threshold: 1
        });
        
        const decembers = document.querySelectorAll('.december');
        decembers.forEach(december => observer.observe(december));
        
        return () => {
            decembers.forEach(december => observer.unobserve(december));
        };
    }, [loadedMonths]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    console.log(forecastData);
    return (
        <div className="App">
            <header>
                <div className='header-banner'>
                    <h2 className='header-year'>{viewYear}년</h2>
                    <div className='header-area'>
                        <FontAwesomeIcon icon={faLocationDot} />
                        <select className='area' name="area" onChange={(e)=>{
                            const valueText = e.target.options[e.target.selectedIndex].text;

                            setSelectedArea(e.target.value);
                            setSelected(valueText);
                            }}>
                            <option value="Seoul,KR">서울</option>
                            <option value="Busan,KR">부산</option>
                            <option value="Daegu,KR">대구</option>
                            <option value="Daejeon,KR">대전</option>
                            <option value="Gwangju,KR">광주</option>
                            <option value="Suwon,KR">수원</option>
                            <option value="Ulsan,KR">울산</option>
                            <option value="Changwon,KR">창원</option>
                            <option value="Jeju,KR">제주</option>
                        </select>
                    </div>
                </div>
                <ul className='header-day'>
                    <li><p>월</p></li>
                    <li><p>화</p></li>
                    <li><p>수</p></li>
                    <li><p>목</p></li>
                    <li><p>금</p></li>
                    <li className='weekend'><p>토</p></li>
                    <li className='weekend'><p>일</p></li>
                </ul>
            </header>
            <div className='calendar'>
                <div className='calendar-info'>
                    <Routes>
                        <Route path='/' element={<Home forecastData={forecastData} weatherImages={weatherImages} selected={selected}/>}/>
                        <Route path='/detail/:id' element={<Detail forecastData={forecastData} weatherImages={weatherImages} selected={selected}/>}/>
                    </Routes>
                </div>
                <div className='calendar-month'>
                {loadedMonths.map(({ month, year }, index) => (
                <div key={index} className={`month ${month == 11 ? `december` : ``}`}>
                    <div className="month-header">
                        {buildCalendar(month, year).emptyDays.map((_, index) => (
                            <div className="date headerDate"></div>
                        ))}
                        <div className="date headerDate">
                            {new Date(year, month).toLocaleString('default', { month: 'long' })}
                        </div>
                    </div>
                    <div className="date-grid">
                        {buildCalendar(month, year).emptyDays.map((_, index) => (
                            <div className="date"></div>
                        ))}
                        {buildCalendar(month, year).daysInMonth.map(({ date, dayOfWeek }) => {
                                    const paddedMonth = String(month + 1).padStart(2, '0');
                                    const paddedDate = String(date).padStart(2, '0');
                                    const findDate = forecastData.find((x) => {
                                        return x.dt_txt.startsWith(`${year}-${paddedMonth}-${paddedDate}`)
                                    });
                                    const findInfo = JSON.parse(localStorage.getItem('info')).find((x)=>{ return x.date == `${year}${paddedMonth}${paddedDate}`});
                                    const isClicked = clickedDate === `${year}${paddedMonth}${paddedDate}`;
                                    const weatherImageUrl = findDate ? weatherImages[findDate.weather[0].main] || null : null;

                                    return (
                                        <div key={date} className={`date true ${(dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : ''} ${findInfo && findInfo.memo.length !== 0 ? 'memoed' : ''}`}
                                            onClick={() => { 
                                                setClickedDate(`${year}${paddedMonth}${paddedDate}`);
                                                navigate(`/detail/${year}${paddedMonth}${paddedDate}`); 
                                                }}>
                                            <p className={`${isClicked ? 'clicked' : ''}`}>{date}</p>
                                            <div className='weatherImg'>
                                            {
                                                findDate && <img src={weatherImageUrl} alt={findDate ? findDate.weather[0].main : 'Weather'} />
                                            }
                                            </div>
                                        </div>
                                    );
                        })}
                    </div>
                </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default App;
