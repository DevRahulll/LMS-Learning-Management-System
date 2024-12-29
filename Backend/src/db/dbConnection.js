import mongoose, { mongo } from 'mongoose'

mongoose.set('strictQuery', false);

const connToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.DB_URI
        );

        if (connectionInstance) {
            console.log(`connected to Database: ${connectionInstance.connection.host}`);
        }
    } catch (error) {
        console.log("Error in connecting Database",error);
        process.exit(1);
    }
}

export default connToDB;