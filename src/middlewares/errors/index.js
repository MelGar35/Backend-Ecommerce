import ErrorList from '../../utils/ErrorList.js'

export default (error, req, res, next) => {
  console.log(error.cause)
  switch (error.code) {
    case ErrorList.INVALID_TYPE_ERROR:
      res.send({ status: "Error", error: error.name })
      break;
    default:
      res.send({ status: "Error", error: "Unhandled Error" })
  }
}
