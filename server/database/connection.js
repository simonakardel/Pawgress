
import mongoose from "mongoose";


const connect = () => {
    console.log(process.env.DATABASE_URL);
    return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

}

export default connect;
