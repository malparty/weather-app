"use client";

import {
  CurrentWeatherType,
  DailytWeatherType,
  HourlyWeatherType,
  getWeather,
} from "@/api/APICalls";
import { useEffect, useState } from "react";
import DayCard from "../components/card/DayCard";
import Header from "../components/header/Header";
import TableRow from "../components/table/TableRow";

export default function Home() {
  const [currentData, setCurrentData] = useState<CurrentWeatherType>();
  const [dailyData, setDailyData] = useState<DailytWeatherType[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyWeatherType[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 10, longitude: 10 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          alert(
            "There was an error getting your location. Please allow to use your location and refresh the page."
          );
        }
      );
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      const weatherData = await getWeather(
        location.latitude,
        location.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
      console.log(weatherData.daily);

      if (weatherData.current) {
        setCurrentData(weatherData.current);
      }

      if (weatherData.daily) {
        setDailyData(weatherData.daily);
      }

      if (weatherData.hourly) {
        setHourlyData(weatherData.hourly);
      }
    };

    getData();
  }, [location]);

  // if(currentData == null || currentData == undefined){
  //   return '';
  // }

  return (
    // className="flex min-h-screen flex-col items-center justify-between p-24"
    <main className={`${currentData == null ? "blur-md" : ""} `}>
      <Header
        currentTemp={currentData?.currentTemp}
        highTemp={currentData?.highTemp}
        lowTemp={currentData?.lowTemp}
        highFeelsLike={currentData?.highFeelsLike}
        lowFeelsLike={currentData?.lowFeelsLike}
        windSpeed={currentData?.windSpeed}
        precip={currentData?.precip}
        iconCode={currentData?.iconCode}
      />
      <section className="grid grid-cols-[repeat(auto-fit,100px)] gap-2 justify-center p-4">
        {dailyData.map((item, index) => (
          <DayCard
            key={index}
            iconCode={item.iconCode}
            timestamp={item.timestamp}
            degree={item.maxTemp}
            // className="border-red-600"
          />
        ))}
        {/* <DayCard
          // icon={<FaSun className="w-16 h-16" />}
          iconCode={999}
          day="Monday"
          degree={32}
        /> */}
      </section>

      <table className="w-full text-center border-spacing-0">
        <tbody>
          {hourlyData.map((item, index) => (
            <TableRow
              key={index}
              maxTemp={item.maxTemp}
              feelsLike={item.feelsLike}
              precip={item.precip}
              timestamp={item.timestamp}
              windSpeed={item.windSpeed}
              iconCode={item.iconCode}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
}
