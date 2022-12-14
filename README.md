# Screen sharing
Simple in-browser screen sharing application written in Vue using WebRTC.

![Screenshot 2022-09-03 at 22 17 41](https://user-images.githubusercontent.com/50334482/188288210-af8dcd8b-8e0c-4cb7-a77e-00ee138bac65.png)

# Installation
Clone the repository and install dependencies using;
```shell
$ npm install
```

Then build the project with;
```shell
$ npm run build
```

The generated files will be placed in the `dist/` directory once the build finishes. After that, any static
file server can be used to serve the generated website.

## Docker
You can also build the project with Docker;
```shell
$ docker build -t screen-sharing .
```

And run the image with;
```shell
$ docker run -dp 80:80 screen-sharing
```

The application will now be up and running on port 80.

### Note
Many browsers **require** the website to be served over **HTTPS** before they allow WebRTC communication.
