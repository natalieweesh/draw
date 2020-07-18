# telephone pictionary!

https://wonderful-easley-d68795.netlify.app/

join a room with your friends, and start playing!

you will start by writing a random word or phrase

then for each subsequent round you will be given a picture to translate into words, or words to translate into a picture

when your words come around back to you, you get to see how your words were translated by everyone down the line!

### examples of the funsies:

<table>
  <tr>
  <td>
    <img src=""/>
  </td>
  <td>
    <img src=""/>
  </td>
  </tr>
</table>


### running the app locally:

from the client/ directory:
npm start

from the server/ directory:
yarn start

examples of the funsies you can have:


### to deploy the app:

from the client/ directory:
npm run build
netlify login
netlify deploy
(when it asks for which folder, put in `./build`)
netlify deploy --prod
(also put `./build`)

from the server/ directory:
heroku login
git push heroku master
