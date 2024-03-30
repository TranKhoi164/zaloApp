
const config = () => {
  // let NODE_ENV='testing';
  let NODE_ENV='testing';
  let REACT_APP_SERVER_URL 
  if (NODE_ENV=='development') {
    REACT_APP_SERVER_URL='http://localhost:5000'
  } else if (NODE_ENV=='testing') {
    REACT_APP_SERVER_URL='https://taskapp-server-n3ai.onrender.com'
  }

  let resObj = {
    NODE_ENV: NODE_ENV,
    REACT_APP_SERVER_URL: REACT_APP_SERVER_URL,
  }

  return resObj
}

export default config
