import axios from "axios";
import mysql from "mysql";
import {HOST_NAME} from "./constants";
var connection=mysql.createConnection({
  host:"171.241.46.90",
  // host:"localhost",
  user: "root",
  password: "huyhoang10032000@gmail.com",
  database: "chat_app",
  port: 3306,
}); 
connection.connect((err:mysql.MysqlError) => {
  if (err) {
    console.log("Server connect error");
    console.log(err);    
  } else {
    console.log("Database established");
  }
});

const options = {
  // responseType: 'text',
  headers: {
    'user-agent':'Node-NoIP/v' + "1.0.2" + ' ' +"huyred1003@gmail.com"
  },
  auth: {
    username: "huyred1003@gmail.com",
    password: "H1u2y3123"
  },
  params: {
    hostname:"socketservercn11.ddns.net"
  }
}

// axios.get('https://dynupdate.no-ip.com/nic/update',{...options}).then((response)=>{
//   const ip=response.data.split(" ")[1].replace(/(\r\n|\n|\r)/gm, "");
  
//   connection= mysql.createConnection({
//     host:ip,
//     user: "root",
//     password: "",
//     database: "chat_app",
//     port: 3306,
//   });

//   connection.connect((err:mysql.MysqlError) => {
//     if (err) {
//       console.log("Server connect error");
//       console.log(err);    
//     } else {
//       console.log("Database established");
//     }
//   });

// })



export default connection;
