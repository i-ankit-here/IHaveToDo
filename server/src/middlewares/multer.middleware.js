import multer from "multer"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
      cb(null, "./src/public")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.fieldname)
    }
  })
  
  export const upload = multer({ storage: storage })