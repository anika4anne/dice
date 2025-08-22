# Dice Game

[![Athena Award Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Faward.athena.hackclub.com%2Fapi%2Fbadge)](https://award.athena.hackclub.com?utm_source=readme)

1) What is my project?
  - My project is a dice game, and basically you roll a dice and (there's different game modes, so rn i'll just explain one of them), if the number you rolled adds up to be more than the number rolled by your opponent you win
2) Why i made this project?
- I made this project because it was it was a pretty cool idea,and i really wanted to start getting into making private rooms and stuff like that so i can soon make real 3d games
3) How i made this project?
  - Okay so my project is built with next.js, and used pnpm create t3-app, which sets up all the essential files, and from there on i can create folders and page.tsx to route it to different pages of my website
4) What i struggled with and what I learnt
  - I struggled with making private rooms and having live syncing work because i would originally have to reload for new players to join a private room, and i fixed it by using local storage system rather than using websockets (using websockets i tried it but it got complicated and i gave up)


You can clone my website with the following commands (if you want to)

git clone [https://github.com/your-username/your-repo](https://github.com/anika4anne/dice.git)]
cd mind-method
npm install
npm start

Website: (https://dice-wheat.vercel.app/)

Some things to know: I've got the background image for free from google (yes i've check for copyright and it's made for people to use)

Images:
This is the homepage

<img width="1905" height="1069" alt="image" src="https://github.com/user-attachments/assets/66888fa3-9fb1-4b89-96d7-6e783b50e0b4" />


Play Solo 
You can change the game settings, there are multiple ways to play the game (<img width="242" height="150" alt="image" src="https://github.com/user-attachments/assets/0ccaa5d2-2e13-4070-afdb-05d32a526662" />
)

<img width="677" height="685" alt="image" src="https://github.com/user-attachments/assets/5cdbb217-218a-403e-ad85-039534fbd3d6" />


This is how it looks whne you start the game
<img width="870" height="617" alt="image" src="https://github.com/user-attachments/assets/e16416b6-db1e-4888-9f39-54fc2cc7eb37" />

Multplayer: 
You can add up to 6 people, and they will all play on the same laptop
<img width="621" height="660" alt="image" src="https://github.com/user-attachments/assets/a616461e-110b-4af0-a6e6-9a88159ee9fa" />

<img width="1696" height="1005" alt="image" src="https://github.com/user-attachments/assets/e299a301-374c-4f7e-9148-01639070816b" />

Also added a feauture where you can leave the room by clicking the red button at the bottom. 

Create Private Room:
You can create a separate room for your friends where they play on their own devices
<img width="799" height="927" alt="image" src="https://github.com/user-attachments/assets/4ac81df6-4706-461b-a234-df7b8e3efc86" />

<img width="1313" height="1034" alt="image" src="https://github.com/user-attachments/assets/365b3794-4056-4051-a8d8-bc59e866ad79" />

I've also added a feature where player can change their icon, so they don't always have to stick to their plain old person emoji. 
Also some more features i have added:
  - Player can now change the color of their own box, and set it to whatever color they want it to be
  - THere is now a chat box so everyone get type it in to messsage your friends during a game

I've also added a confetti thing, so when a new player joins it shows up

Join private room: 

<img width="822" height="996" alt="image" src="https://github.com/user-attachments/assets/5823b320-f9f6-41ba-bc45-68a064fa60db" />

<img width="1681" height="999" alt="image" src="https://github.com/user-attachments/assets/d8bc5e30-f1b6-446e-ab71-40cc00495d02" />

Host is allowed to kick people, and when host kicks people the players get notification ---- left the room, and if someone joins the room it says ---- joined the room
Also if host leaves the room, then the player who joined right after the host is given all the host perms
When people change their box color, is the color is dark then the text on it automatically become white, and if the color changes to light color then the tect automatically become black, that way it's easier to see and adjusts pretty quickly



