
# Chat-App

Basic chat application made with NodeJS, Express and Socket.io. Have fun chatting with your friends! If you want to play with this app go to https://chat.ravenstudio.ga




## Dependencies
- express
- express-session
- socket.io
- nodemon
- axios
- ejs

## Installation

How run the project. First clone the repository and go to the directory of the project you downloaded. Then install dependencies.
```bash
git clone https://github.com/WicherK/Chat-App.git
cd ../Chat-App
npm install
```

Before you start the app you need to create JSON file called **secrets.json** in the **root directory** of the project with this body:
```JSON
{
    "key": "<your_secret>" 
}
```

You are good to start the app by running this command.
```bash
nodemon app.js
```

## Usage
First u need to create an account then log in.

If you want to join to someone's room, get the link from your friend and paste it in the search bar. Now you can communicate.


## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
