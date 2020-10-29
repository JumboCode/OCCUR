# OCCUR
## Welcome
Welcome to the OCCUR web application, a project run through Tufts JumboCode. Here are some steps to get you started.

## Team Members:
* PM and Developer: [Keisha Mukasa](https://github.com/kmukasa)
* Engineer Lead and Developer: [Luke Taylor](https://github.com/controversial)
* Developer: [Tina King](http://github.com/tinaking28)
* Designer and Developer: [Mikayla Clark](http://github.com/mikaylaclark)
* Developer: [Deanna Oei](https://github.com/de08oei)
* Developer: [Grace Kayode](https://github.com/12grace12)
* Developer: [Noah Chopra Khan](https://github.com/noahck2000)
* Developer: [Eric Toh](https://github.com/EricToh)
* Developer: [Jonathan Lai]( https://github.com/jlai03)
* Developer: [Rusny Rahman](https://github.com/rusny23)
* Developer: [Brendon Bellevue](https://github.com/Jedzter)
* Developer: [Eddie Hatfield](https://github.com/e-hat)

## Recommended software
* [Postman](https://www.postman.com/)(free)

## Architecture Overview
- Frontend: React and NextJS
- Backend: Django and DjangoREST Framework
- Database: PostgreSQL

## How to Clone This Repo on Local Machine
1. `cd <local directory in which you want to keep this directory>`
2. `git clone https://github.com/JumboCode/OCCUR.git` --> Clones this repo
3. `git branch <name of branch>` --> Make sure you make your own branch before you start editing the source code
Running the project locally

### Frontend
First, run the development server:
```
npm run dev
#or
yarn dev
```
Open http://localhost:3000 with your browser to see the result.
You can start editing the page by modifying pages/index.js. The page auto-updates as you edit the file.

## Backend
We're using venv to contain requirements and keep track of the packages we're using. Name your environment backendEnv inside /api/, so you don't need to change your .gitignore.
```cd backend
python3 -m venv backendEnv
source backendEnv/bin/activate
pip install -r requirements.txt
python3 manage.py runserver
```
To deactivate the environment:
`deactivate`

## Essential Git Commands
### Making a branch
- `git branch <name>`

### Moving to a branch
- `git checkout <name>`

### Make new branch and switch to it immediately
- `git branch -b <name>`

### How to commit changes
- `git status` --> Check if you have made any changes, deleted files or added files
- `git add -u` to add untracked files or git add <filename> to add specific files. Files are added to staging.
- `git commit -m` "Commit message" --> please write descriptive commit messages based on your changes
- `git push origin <name>` --> do not haphazardly push to master 

### Updating a branch
- `git checkout <branch you want to update>`
- `git pull origin master` --> There may be conflicts so when that happens, please handle them accordingly.

### Git history
- `git log`

## Pull requests 
- Go to the GitHub page
- If you don't see your recently updated branch, go to the branches tab and find your branch.
- Click on compare and make pull request
- Here, you can compare the branches -- your branch vs master
- When making a pull request, title it PR- “the ticket name”.
- Enter information about what you did and what your reviewer can do to test it
- Create Pull Request
- Select code reviewers!
 
 
 
 

