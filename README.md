## Website
This project can be checked at: http://unn-w20020581.newnumyspace.co.uk/teamAssessment/app/

## API
The API of the project is hosted on newnumyspace: http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/

## Github
This project repository is available at: https://github.com/SzymonJedrzychowski/SH06-TeamAssessment  
SECRET and API_KEY are not filled in on Github files for privacy reasons.

## Installation

### API
The API can be used on personal server (only newnumyspace servers were tested).
To use the API, the directory /api needs to be uploaded to the server.
Additionally, in file /api/config/config.php, the global variable PATH needs to be changed to the position of the /api directory on the newnumyspace server.

If following images are not loading, please open the submission folder with your code editor or look for images in /data directory.

Example structure of the API on server with following PATH:  
define('PATH', "/teamAssessment/api");

![Screenshot](/data/capture1.PNG)

Additional variables in /api/config/config.php that need to be changed (for purposes of demontration, these values are already filled):  
SECRET - This should be a randomly generated key that should not be shared with anyone.  
API_KEY - This key was assigned by SendGrid that is used as email provider for this project.  
EMAIL - Email address that is used by SendGrid account.

Important:  
To make the APP use uploaded API, changes need to be made in APP code (see installation of APP).

### APP
Node.js is required for the APP to run locally or to upload it to a server (tested version: v18.12.1).  
The APP can be used on personal server (only newnumyspace servers were tested) or locally.

Firstly, run "npm install" (without the quotation marks) in /app directory.

Locally:
Follow the npm instructions in /app/README.md

On server:  
Example structure of APP folder on server:

![Screenshot](/data/capture2.PNG)

Important:  
If you want to use API from different server, you need to change the following code in /app/.env to the corresponding hyperlink of that server.  
REACT_APP_API_LINK="http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/"

The variables "homepage" (line 5 of /app/package.json) and "basename" (line 18 of /app/src/index.js) also need to be changed to the path in which the /app folder was uploaded.  
Additionally, in file /app/.htaccess, in line 9, the link should be changed to location of the index.js file on the server.  
Example:

![Screenshot](/data/capture3.PNG)

Using following path on the server means that variables homepage and basename should be changed to: "/test/application"  
and link in .htaccess should be changed to: . /test/application/index.html

To use the APP, build files need to be created and uploaded to the server.  
To create /app/build locally, run "npm run build" from the app directory.  
Then upload the contents of the app/build folder to the server.  
Additionally, the /app/.htaccess file needs to be uploaded to the same folder as files from /app/build

## Sending newsletter emails
After a new newsletter is published, emails are sent to the subscriber list. A free version of SendGrid is used for this purpose and allows 100 emails/day.  
However, it was found that not all emails sent to "@northumbria.ac.uk" emails are received (because of email protection).  
We advise using different email providers (such as gmail) to test this functionality. The email still might end up in spam folder.

## Resources used
The structure and base code of this project was based on the code of team member (Szymon Jedrzychowski) and can be found on github:  
Szymon Jedrzychowski (2023), "WebDevelopmentAssessment". Available at: https://github.com/SzymonJedrzychowski/WebDevelopmentAssessment (Access date: 24.03.2023)

During production of the code, several sources were used. Sources of the re-used or base code are mentioned in the comments.

Favicon.ico (and other favicon related files) (no date), John Sorrentino, Available at: https://favicon.io/favicon-generator/ (Access date: 24.03.2023) 