// import React from 'react';
import { useLanguage } from "../context/LanguageContext";

export function LandingPage() {
  const {t} = useLanguage();
  return (
  <div className='flex flex-col items-start gap-4 w-5/6 mx-auto'> 
    <h2>{t.about.aboutProject}</h2>
    <p>{t.about.aboutProjectDes[0]}</p>
    <p>{t.about.aboutProjectDes[1]}</p>
    <p>{t.about.aboutProjectDes[2]}</p>
    <h2>{t.about.aboutUs}</h2>
    <div className='flex flex-row justify-around gap-4 w-full'>
      <div>
        {/* <img src="" alt="" /> */}
        <h3>Lea Hoang</h3>
        <p>Something about me</p>
      </div>
      <div>
        {/* <img src="" alt="" /> */}
        <h3>Bachelor Tutor</h3>
        <p>Something about her</p>
      </div>
    </div>
  </div>
  
);
}