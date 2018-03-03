# Yuuri

## Tables of content

* [Disclaimer](https://github.com/ParadoxalCorp/Yuuri/blob/master/README.md#disclaimer)
* [Installing Yuuri](https://github.com/ParadoxalCorp/Yuuri/blob/master/README.md#installation)
* [Setting up the database](https://github.com/ParadoxalCorp/Yuuri/blob/master/README.md#setting-up-the-database)
* [Running Yuuri](https://github.com/ParadoxalCorp/Yuuri/blob/master/README.md#running-yuuri)
* [Contributing](https://github.com/ParadoxalCorp/Yuuri/blob/master/README.md#contributing)

## Disclaimer 

_Yuuri_ is under **GNU General Public License v3.0** license, you may **not** use this in a public project without complying to all
the license conditions (as in: Source has to be disclosed, the changes needs to be stated, this same license has to be used and finally the original work
has to be credited) . 

In case of **private** use (like personal self-host), you may ignore the constraints to: Disclose the source, state the changes and the use of the same license.

I, (ParadoxOrigins, and any person being a part of the ParadoxalCorp organization now or in the future), do not guarantee to offer any help/support in case anything 
goes wrong. You still can open issues stating your issues, if you are a cool person you will _probably_ get an answer.

I hate to write this, but seeing as some people just go, steal the work of other people and claim it as their own, i want to make things clear.
This is why we can't have nice things.

## Installation

* Open a command line 
* Run `git clone git://github.com/ParadoxalCorp/Yuuri.git` (if you don't have it [git](https://git-scm.com/) installed, download and install it first. Or just download the zip, do as you wish)
* Direct your command line in the newly created folder 
* Run `npm install` once you are in
* You're all set ! See [here](https://github.com/ParadoxalCorp/Yuuri/blob/master/README.md#setting-up-the-database) to setup the database and [here](https://github.com/ParadoxalCorp/Yuuri/blob/master/README.md#running-yuuri) to see how to run _Yuuri_

## Setting up the database

You will need to download [RethinkDB](https://rethinkdb.com/docs/install/) and unzip it somewhere on your PC/server.

Then follow the [instructions](https://rethinkdb.com/docs/quickstart/) on the RethinkDB documentation to first start the server (Read the "Start the server" part). The database values in the config.json file are the default RethinkDB uses, you may need to change them in some cases but you usually can leave it like that.

**Note that the server must always be launched before the bot**

## Running Yuuri

Before launching anything, you need to fill the config.js file which is located at the root of the project.

You need to at least fill the `token`, `ownerID`, `botID` and `admins` fields.

Once you've got that done, open a command line at the root folder of the project and run:

> node index

Alternatively, you can run Yuuri without the database like the following:

> node index --no-db

## Contributing

Any contribution is more than welcome, here are the steps toward a "cool" PR:

* Fork the repository
* Code as your heart wishes and, as i try to force a consistent code style in Yuuri, comply to ESLint
* Open a pull request ! 

