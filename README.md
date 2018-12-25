# Orchid Frontend

This frontend project is a part of this [Spring Boot Application](https://github.com/adnirjhar/orchid-backend). It provides the user interface for the entire system. It simply works with REST services from backend and uses Websocket to receive device updates.
Learn more at this [Medium article.](https://medium.com/@nitam/google-dialogflow-spring-boot-angular-mqtt-esp8266-anything-42d8e19dedec)

### Clone
```sh
$ git clone git@github.com:adnirjhar/orchid-frontend.git
$ cd orchid-frontend
```

### Install dependencies & run
```sh
$ npm install
$ npm run start
```
To access, browse to http://localhost:4200/orchid/
### Configure application
##### Set the base href according to backend context path.
By default, the base href has been set to the context path of the [corresponding backend project](https://github.com/adnirjhar/orchid-backend/blob/master/src/main/resources/application.properties). If you choose to change, you can change it in the `package.json` file.
![](https://i.ibb.co/51nRkJW/Screen-Shot-2018-12-16-at-4-54-20-PM.png")
##### Turn on/off live reload
Set the `--live-reload` param to `true` to enable Live Reload, in `package.json` file.
![](https://i.ibb.co/2FD4dNW/Screen-Shot-2018-12-16-at-4-56-42-PM.png")


### Build
```sh
$ cd orchid-frontend
$ npm run build
```
