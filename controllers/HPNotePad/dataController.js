const Data = require("../../models/HPNotePad/dataModel");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const errorMessage = "Error";

const getJoke = async () => {
  const options = {
    method: "GET",
    url: "https://dad-jokes.p.rapidapi.com/random/joke",
    headers: {
      "X-RapidAPI-Key": "0824a2c382mshb6a7ecac1677e76p11250cjsndc3ea1d6ec95",
      "X-RapidAPI-Host": "dad-jokes.p.rapidapi.com",
    },
    timeout: 10000, // 10 seconds
  };

  try {
    let response = await axios.request(options);
    if (response.status >= 200 && response.status < 300) {
      // console.log("success");
      const joke = {
        setup: response.data.body[0].setup,
        punchline: response.data.body[0].punchline,
      };
      return joke;
    } else {
      // console.log("success");
      return errorMessage;
    }
  } catch (error) {
    console.log(error.message);
    return errorMessage;
  }
};

const getHoroscope = async (signHS) => {
  const options = {
    method: "GET",
    url: `https://ohmanda.com/api/horoscope/${signHS}/`,
    timeout: 10000, // 10 seconds
  };
  try {
    let response = await axios.request(options);
    if (response.data.horoscope) {
      console.log("success");
      return response.data.horoscope;
    } else {
      console.log("success");
      return errorMessage;
    }
  } catch (error) {
    console.log(error.message);
    return errorMessage;
  }
};

//third api call - moonphase
const getMoonPhase = async () => {
  const options = {
    method: "GET",
    url: "https://moon-phase.p.rapidapi.com/moon_phase/",
    headers: {
      // gmail key
      // "X-RapidAPI-Key": "0824a2c382mshb6a7ecac1677e76p11250cjsndc3ea1d6ec95",
      // yahoo key
      "X-RapidAPI-Key": "6055e6d211mshaddfa5288b1aaffp1a1b1ajsnbc9b8ca2a7a6",
      "X-RapidAPI-Host": "moon-phase.p.rapidapi.com",
    },
    timeout: 10000, // 10 seconds
  };

  try {
    let response = await axios.request(options);
    if (response.status >= 200 && response.status < 300) {
      console.log("success");
      const moonphaseData = {
        mainText: response.data.mainText,
        emoji: response.data.emoji,
      };
      return moonphaseData;
    } else {
      console.log("success");
      return errorMessage;
    }
  } catch (error) {
    console.log(error.message);
    return errorMessage;
  }
};

//fourt api call - weather
const getForecast = async () => {
  const options = {
    method: "GET",
    url: "https://forecast9.p.rapidapi.com/rapidapi/forecast/Barcelona/summary/",
    headers: {
      "X-RapidAPI-Key": "0824a2c382mshb6a7ecac1677e76p11250cjsndc3ea1d6ec95",
      "X-RapidAPI-Host": "forecast9.p.rapidapi.com",
    },
    timeout: 10000, // 10 seconds
  };

  try {
    let response = await axios.request(options);
    if (response.status >= 200 && response.status < 300) {
      console.log("success");
      const items = response.data.forecast.items;
      const extractedData = items.slice(0, 10).map((item) => ({
        date: item.date,
        min: item.temperature.min,
        max: item.temperature.max,
      }));

      return extractedData;
    } else {
      console.log("success");
      return errorMessage;
    }
  } catch (error) {
    console.log(error.message);
    return errorMessage;
  }
};

const getNews = async () => {
  const options = {
    method: "GET",
    url: "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI",
    params: {
      q: "spain",
      pageNumber: "1",
      pageSize: "10",
      autoCorrect: "true",
      fromPublishedDate: "null",
      toPublishedDate: "null",
    },
    headers: {
      "X-RapidAPI-Key": "0824a2c382mshb6a7ecac1677e76p11250cjsndc3ea1d6ec95",
      "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
    },
    timeout: 10000, // 10 seconds
  };

  try {
    let response = await axios.request(options);
    if (response.status >= 200 && response.status < 300) {
      console.log("success");
      const items = response.data.value;
      const extractedData = items.slice(0, 5).map((item) => ({
        title: item.title,
        url: item.url,
        description: item.description,
        body: item.body,
        snippet: item.snippet,
        image: item.image.url,
      }));

      return extractedData;
    } else {
      console.log("success");
      return errorMessage;
    }
  } catch (error) {
    console.log(error.message);
    return errorMessage;
  }
};

const fetchData = asyncHandler(async (req, res) => {
  let time = new Date();
  let fetchedDataObject = {};
  fetchedDataObject.date = time;
  fetchedDataObject.horoscope = {};
  const horoscopeData = {};

  const [joke, moonPhase, forecast, news] = await Promise.all([
    getJoke(),
    getMoonPhase(),
    getForecast(),
    getNews(),
  ]);

  //assign jokes data
  fetchedDataObject.joke = joke;

  //assign moonPhase data
  fetchedDataObject.moonPhase = moonPhase;

  //assign forecast data
  fetchedDataObject.forecast = forecast;

  //assign news data
  fetchedDataObject.news = news;

  //assign horoscopes data
  const horoscopeSigns = [
    "aquarius",
    "pisces",
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
  ];
  const results = await Promise.all(
    horoscopeSigns.map(async (sign) => await getHoroscope(sign))
  );
  results.forEach((result, index) => {
    horoscopeData[horoscopeSigns[index]] = result;
  });
  fetchedDataObject.horoscope = horoscopeData;

  //save data to db
  saveDataToDB(fetchedDataObject);
});

const saveDataToDB = async (objectToSave, req, res) => {
  let time = new Date();
  console.log(objectToSave + "objectToSave from within saveDataToDB");

  const newData = new Data({
    date: time,
    horoscope: objectToSave.horoscope,
    joke: objectToSave.joke,
    moonPhase: objectToSave.moonPhase,
    forecast: objectToSave.forecast,
    news: objectToSave.news,
  });

  try {
    await newData.save();
    console.log("saved to db");
    if (res) {
      res.status(200).json({ message: "Data saved to DB" });
    }
    return res.json({ message: "Data saved to DB" });
  } catch (error) {
    console.log(error.message);
    console.log("error from within saveDataToDB");

    return;
  }
};

// @desc    fetch data
// @route   get /api/data
// @access  Public

const getDataByDate = asyncHandler(async (req, res) => {
  try {
    const dateToFind = req.params.date;
    const startOfDay = new Date(dateToFind);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    const data = await Data.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).exec();
    if (data && data.length > 0) {
      res.json(data);
    } else {
      console.log("no data for this date");
      res.status(404).json({ message: "No data for this date" }).end();
    }
  } catch (error) {
    // console.error(ERROR getting data for date: ${date});
    console.log(error.message);
    res.status(500).end();
  }
});

//function to delete all data from before february 12th, 2023
const deleteAllData = asyncHandler(async (req, res) => {
  console.log("deleteAllData");

  const dateToFind = "2023-02-12";
  // const dateToFind = req.params.date;
  const startOfDay = new Date(dateToFind);
  console.log(startOfDay);
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

  try {
    const data = await Data.deleteMany({
      date: { $lte: endOfDay },
    });
    res.json(data);
    console.log("data deleted");
  } catch (error) {
    console.log(error.message);

    res.status(500).end();
  }
});

module.exports = { fetchData, getDataByDate, deleteAllData };
