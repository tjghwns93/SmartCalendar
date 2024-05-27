import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function Detail (props){
    const {id} = useParams();
    const year = id.slice(0, 4);
    const month = id.slice(4, 6);
    const day = id.slice(6, 8);
    const getData = JSON.parse(localStorage.getItem('info')) || []; 
    const findDate = getData.find((x) => x.date === id);
    const [infoMemo, setInfoMemo] = useState(findDate ? findDate.memo : '');
    const findForecast = props.forecastData.filter((x) => {
        return x.dt_txt.startsWith(`${year}-${month}-${day}`);
    });
    
    useEffect(()=>{
        let info = {
            date : id,
            memo : infoMemo
        }
        
        if(findDate === undefined){
            getData.push(info);
        }else{
            findDate.memo = infoMemo;
        }
        
        localStorage.setItem('info', JSON.stringify(getData));
        
    },[infoMemo]);

    useEffect(()=>{

        if(findDate){
            if(findDate.memo !== infoMemo){
                setInfoMemo(findDate.memo);
            }
        }else if(findDate === undefined){
            setInfoMemo('');
        }

    },[id])


    return (
        <div className="info">
            <div className="info-weather">
                <p className="info-weather-header">{`${year}년${month}월${day}일`}{findForecast.length !== 0 && ` ${props.selected}날씨`}</p>
                <div className="info-weather-data">
                    <ul>
                        {
                            findForecast.map((a, i)=>{
                                const hour = a.dt_txt.split(' ')[1].split(':')[0] + '시';
                                return (
                                    <li key={i}>
                                        <p className="degree">{parseInt(a.main.temp)}&deg;</p>
                                        <div className="degreeBar" style={{ height: `calc(${a.main.temp}px * 1.2)` }}></div>
                                        <div className="weatherBox">
                                            <img src={props.weatherImages[a.weather[0].main]} />
                                        </div>
                                        <p className="time">{hour}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <textarea className="info-memo"
                spellCheck={false}
                value={infoMemo}
                onChange={(e) => {
                    setInfoMemo(e.target.value);
                }}
                placeholder="메모를 입력하세요"
            />
        </div>
    )
};

export default Detail;