## Website
This project can be checked at: http://unn-w20020581.newnumyspace.co.uk/teamAssessment/app/

## API
The API of the project is hosted on newnumyspace: http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/


## Github
This project repository is available at: https://github.com/SzymonJedrzychowski/SH06-TeamAssessment

## Installation

### API
API can be used on personal server (only newnumyspace servers were tested).
To use the API, directory /api needs to be uploaded to the server.
Additionally, in file /api/config/config.php, global variable PATH needs to be changes to position of the /api directory on the newnumyspace server.

Example structure of the API on server with following PATH:
define('PATH', "/teamAssessment/api");

![Screenshot](/data/capture1.PNG)

Additional variables in /api/config/config.php that need to be changed (for purposes of demontration, these values are already filled):
SECRET - This should be a randomly generated key, that should not be shared with anyone.
API_KEY - This key was assigned by SendGrid that is used as email provider for this project.
EMAIL - Email address that is used by SendGrid account.

Important:
To make the APP use uploaded API, changes need to be made in APP code (see installation of APP).

### APP
Node.js is required for the APP to run locally or to upload it on the server (tested version: v18.12.1).

APP can be used on personal server (only newnumyspace servers were tested) or locally.

Locally:
Follow the npm instructions in /app/README.md

On server:
(To create /app/build locally, run npm )
To use the APP, files from /app/build need to be uploaded to the server.
Additionally, file /app/.htaccess needs to be uploaded to the same folder as files from /app/build

Example structure of APP folder on server:

![Screenshot](/data/capture2.PNG)

Important:
If you want to use API from different server, you need to change the following code in /app/.env to corresponding hyperlink of the server.
REACT_APP_API_LINK="http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/"

Variables "homepage" (line 5 of /app/package.json) and "basename" (line 18 of /app/src/index.js) also need to be changed to the path in which the /app folder was uploaded.

## Resources used
The structure and base code of this project was based on the code of team member (Szymon Jedrzychowski) and can be found on github: 
Szymon Jedrzychowski (2023), "WebDevelopmentAssessment". Available at: https://github.com/SzymonJedrzychowski/WebDevelopmentAssessment (Access date: 24.03.2023)

During production of the code, several sources were used. Sources of the re-used or base code are mentioned in the comments.

Favicon.ico (and other favicon related files) (no date), John Sorrentino, Available at: https://favicon.io/favicon-generator/ (Access date: 24.03.2023) 