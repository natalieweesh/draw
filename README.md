# telephone pictionary!

https://draw.nataliewee.com

join a room with your friends, and start playing!

you will start by writing a random word or phrase

then for each subsequent round you will be given a picture to translate into words, or words to translate into a picture

when your words come around back to you, you get to see how your words were translated by everyone down the line!

### examples of the funsies:

<table>
  <tr>
  <td>
    <img src="https://user-images.githubusercontent.com/3805607/87841970-122fb000-c877-11ea-8331-b14e740b1bde.png" />
  </td>
  <td>
    <img src="https://user-images.githubusercontent.com/3805607/87841979-1bb91800-c877-11ea-90b5-e0ee16912921.png" />
  </td>
  <td>
    <img src="https://user-images.githubusercontent.com/3805607/87841990-31c6d880-c877-11ea-8de5-0f737f64c08b.png" />
  </td>
  </tr>
  <tr>
  <td>
    <img src="https://user-images.githubusercontent.com/3805607/87841985-22e02600-c877-11ea-9009-37748c30b345.png" />
  </td>
  <td>
    <img src="https://user-images.githubusercontent.com/3805607/87841982-1f4c9f00-c877-11ea-8cf5-6ad1eff19c8f.png" />
  </td>
    <td>
      <img src="https://user-images.githubusercontent.com/3805607/88309271-0fe8ae00-ccdc-11ea-8bf4-29d60c882e08.JPG" />
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

`npm run build`

`netlify login`

`netlify deploy`

(when it asks for which folder, put in `./build`)
netlify deploy --prod
(also put `./build`)

from the server/ directory:
heroku login
git push heroku master


# Outstanding Bugs
1. When user has submitted drawing and is waiting for others to submit, and user refreshes page, text field with old picture is shown instead of taking the user back to the "waiting for others to submit" page.
2. Sorry not sorry message showing at unexpected points after turning phone on and off
