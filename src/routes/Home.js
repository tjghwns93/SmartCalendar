import { useEffect, useState } from "react";


function Home (props){
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const getData = JSON.parse(localStorage.getItem('info')) || []; 
    const findDate = getData.find((x)=>{ return x.date == `${year}${month}${day}`});
    const [infoMemo, setInfoMemo] = useState(findDate ? findDate.memo : '');
    const findForecast = props.forecastData.filter((x) => {
        return x.dt_txt.startsWith(`${year}-${month}-${day}`);
    });
    
    
    
    useEffect(()=>{
        let info = {
            date : `${year}${month}${day}`,
            memo : ''
        }
        
        if(findDate === undefined){
            getData.push(info);
            localStorage.setItem('info', JSON.stringify(getData));
        }else{
            findDate.memo = infoMemo;
            localStorage.setItem('info', JSON.stringify(getData));
        }
        
    },[infoMemo]);

    console.log(findForecast);

    return (
        <div className="info">
            <div className="info-weather">
                <p className="info-weather-header">{year}년{month}월{day}일 서울날씨</p>
                <div className="info-weather-data">
                    <ul>
                        {
                            findForecast.map((a, i)=>{
                                const hour = a.dt_txt.split(' ')[1].split(':')[0] + '시';
                                return (
                                    <li key={i}>
                                        <p className="degree">{parseInt(a.main.temp)}&deg;</p>
                                        <div className="degreeBar" style={{ height: `calc(${a.main.temp}px * 1.2)` }}></div>
                                        <div className="weatherBox"><img src={props.weatherImages[a.weather[0].main]}/></div>
                                        <p className="time">{hour}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <textarea className="info-memo"
                value={infoMemo}
                onChange={(e) => {
                    setInfoMemo(e.target.value);
                }}
                placeholder="메모를 입력하세요"
            />
        </div>
    )
};

export default Home;