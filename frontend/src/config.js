const prod = {
  API_URL: "http://test.brravo.ru/rest",
};

const dev = {
  API_URL: "http://localhost:5000/rest"
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;
