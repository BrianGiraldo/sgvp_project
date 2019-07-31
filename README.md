# Project SGVP

## Specifications

The project run in angular + php server to back services.

### Versions
* nodejs => 10.16.0
* npm => 6.9.0
* (angular cli) ng => 8.0.6
* php => 7.x
* MySQL => 5.x

# For run the project

## First you need install the prerequisites
**Node JS**
See [https://nodejs.org/es/](https://nodejs.org/es/)

**Angular CLI**
After installing NodeJS run in the command line the next command: `npm install -g @angular/cli@8.0.6`

**Wamp Server or others**
See [http://www.wampserver.com/en/#download-wrapper](http://www.wampserver.com/en/#download-wrapper)

## Second run the php server
*	Copy the folder `SGVP-BackEnd` in the php server folder, like this `C:\wamp64\www\SGVP-BackEnd`
*	Create in the phpmyadmin the db named `sgvp`
*	Create a user with the next params
	*	user: `sgvp_user`
	*	password: `root`
*	Import in the db the next file sql `sgvp_project\SGVP-BackEnd\sgvp.sql`

## Third run the angular project
In the folder root of the project run `npm install`
later..
run `npm start`

### Test users:
**Admin**
user: `admin@email.com`
password: `123456`

**Student**
user: `estudiante@email.com`
password: `123456`

**Enterprise**
user: `empresa@email.com`
password: `123456`

**Teacher**
user: `docente@email.com`
password: `123456`
