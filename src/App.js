import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [locationData, setLocationData] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);

  // 위치 정보를 가져오는 함수
  const fetchLocationData = () => {
    fetch('http://localhost:3001/estimated_location')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const latestLocation = data[data.length - 1]; // 가장 최신 위치 정보
        setLocationData(latestLocation); // 위치 데이터 설정
      })
      .catch((error) => console.error('Error fetching location data:', error));
  };

  // 처음 마운트 될 때 위치 정보를 한 번 가져오고, 10초마다 갱신
  useEffect(() => {
    fetchLocationData(); // 첫 번째 위치 정보 요청
    const interval = setInterval(() => {
      fetchLocationData(); // 10초마다 위치 정보 갱신
    }, 10000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  // 이미지의 크기를 기준으로 좌표를 비율로 계산하는 함수
  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', updateImageSize); // 창 크기 변경 시 이미지 크기 갱신
    updateImageSize(); // 초기 이미지 크기 설정
    return () => window.removeEventListener('resize', updateImageSize);
  }, []);

  // 좌표 계산 함수 (이미지의 크기에 비례하여 계산)
  const getLeftPosition = (zone, imageWidth) => {
    const baseWidth = 1044; // 이미지의 원래 너비 (1044px 기준)
    const positions = {
      A_1: (775+50 / baseWidth) * imageWidth,
      A_2: (558 / baseWidth) * imageWidth,
      A_3: (361 / baseWidth) * imageWidth,
      B_1: (264 / baseWidth) * imageWidth,
      B_2: (4 / baseWidth) * imageWidth,
      C_1: (180 / baseWidth) * imageWidth,
      C_2: (181 / baseWidth) * imageWidth,
      C_3: (180 / baseWidth) * imageWidth,
      D_1: (262 / baseWidth) * imageWidth,
      D_2: ((3+25) / baseWidth) * imageWidth,
      E_1: ((775+(((909-775)/2)-50)) / baseWidth) * imageWidth,
      E_2: ((574+(((775-574)/2)-50)) / baseWidth) * imageWidth,
      E_3: (365 / baseWidth) * imageWidth,
    };
    return positions[zone] || 0;
  };


  const getTopPosition = (zone, imageHeight) => {
    const baseHeight = 920; // 이미지의 원래 높이 (920px 기준)
    const positions = {
      A_1: (685 / baseHeight) * imageHeight,
      A_2: (712 / baseHeight) * imageHeight,
      A_3: (712 / baseHeight) * imageHeight,
      B_1: (712 / baseHeight) * imageHeight,
      B_2: (711 / baseHeight) * imageHeight,
      C_1: (537 / baseHeight) * imageHeight,
      C_2: (362 / baseHeight) * imageHeight,
      C_3: (196 / baseHeight) * imageHeight,
      D_1: (43 / baseHeight) * imageHeight,
      D_2: (90 / baseHeight) * imageHeight,
      E_1: ((47+(((226-47)/2)-50))/ baseHeight) * imageHeight,
      E_2: ((91+(((202-91)/2)-50))/ baseHeight) * imageHeight,
      E_3: (92 / baseHeight) * imageHeight,
    };
    return positions[zone] || 0;
  };

  return (
    <div className="App">
      <div className="Map">
        {/* 이미지 크기 및 위치 계산을 위한 ref 사용 */}
        <img
          ref={imageRef}
          src={process.env.PUBLIC_URL + '/assets/map.png'}
          useMap="#imgmap"
          alt="Map"
        />
        <map id="imgmap" name="imgmap">
          <area shape="rect" alt="A_1" id="A_1" coords="775,685,1040,829" href="" />
          <area shape="rect" alt="A_2" id="A_2" coords="558,712,775,825" href="" />
          <area shape="rect" alt="A_3" id="A_3" coords="361,712,559,825" href="" />
          <area shape="rect" alt="B_1" id="B_1" coords="264,712,362,876" href="" />
          <area shape="rect" alt="B_2" id="B_2" coords="4,711,265,826" href="" />
          <area shape="rect" alt="C_1" id="C_1" coords="180,537,294,721" href="" />
          <area shape="rect" alt="C_2" id="C_2" coords="181,362,293,537" href="" />
          <area shape="rect" alt="C_3" id="C_3" coords="180,196,293,362" href="" />
          <area shape="rect" alt="D_1" id="D_1" coords="262,43,365,201" href="" />
          <area shape="rect" alt="D_2" id="D_2" coords="3,90,263,198" href="" />
          <area shape="rect" alt="E_1" id="E_1" coords="775,47,909,226" href="" />
          <area shape="rect" alt="E_2" id="E_2" coords="574,91,775,202" href="" />
          <area shape="rect" alt="E_3" id="E_3" coords="365,92,575,201" href="" />
        </map>
 
        {/* 특정 구역에 아이콘을 렌더링 */}
        {locationData && (
          <div
            className="location-icon"
            style={{
              position: 'absolute',
              left: `${getLeftPosition(locationData.zone, imageSize.width)}px`,
              top: `${getTopPosition(locationData.zone, imageSize.height)}px`,
              width: '100px',
              height: '100px',
              backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/iconlocation.gif'})`,
              backgroundSize: 'cover',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
