# Songwalk

Songwalk is a service for Spotify that uses your location together with data from What3Words to build playlists for you.

## How does this work?

Songwalk uses data from What3Words, and builds playlists with songs from Spotify using that data.

What3Words maps the world as a grid of 3 by 3 meter squares where each square is given three unique words that identify it.
Songwalk uses your position to get the three words that belong to it from What3Words, and then searches for songs in Spotify using those words. The highest-ranking song that Spotify finds is added to your playlist.

## How was it made?

Songwalk was made in 24 hours at the Netlight Hackathon - PAD THAI by Ole Martin Pettersen, Olav Hermansen, and William Killerud - also known as Team Putekrig.

Songwalk was built using a mix of Express.js, AngularJS, jQuery, and Handlebars, as well as a dash of Bootstrap.
The code is pretty messy in places, which is what happens when trying to put together pieces from three different projects with three slightly different stacks. But hey, it works!

