import "./App.css";
import { Auction } from "./components/Auction";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chat } from "./components/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auction />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import { Component } from "react";

// const url = "ws://localhost:3000";
// const wss = new WebSocket(url);
// console.log(wss);

// export const socket = io("ws://127.0.0.1:8000");

// const client = new W3CWebSocket("ws://127.0.0.1:8000");

// export default class App extends Component {
//   state = {
//     userName: "",
//     isLoggedIn: false,
//     messages: [],
//   };

//   onButtonClicked = (value: any) => {
//     client.send(
//       JSON.stringify({
//         type: "message",
//         msg: value,
//         user: this.state.userName,
//       })
//     );
//     this.setState({ searchVal: "" });
//   };
//   componentDidMount() {
//     client.onopen = () => {
//       console.log("WebSocket Client Connected");
//     };
// client.onmessage = (message) => {
//   const dataFromServer = JSON.parse(message.data);
//   console.log('got reply! ', dataFromServer);
//   if (dataFromServer.type === "message") {
//     this.setState((state) =>
//       ({
//         messages: [...state.messages,
//         {
//           msg: dataFromServer.msg,
//           user: dataFromServer.user
//         }]
//       })
//     );
//   }
// };
// }

// return (
//   <div className="App">
//     <Auction />
//   </div>
// );
// }

// export default App;
