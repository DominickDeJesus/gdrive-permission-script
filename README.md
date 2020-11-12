# Google Drive Permission Script

This script will add/remove edit permissions from a google drive file/folder given a list of emails. This script is run through the command line.  

## Setup for development

1. Go to https://console.developers.google.com/

2. Create/select a project.

3. Enable the Google Drive API.

4. Go to https://console.developers.google.com/apis/credentials and create a service account for the project.

5. Click Create Credentials -> Service Account -> Type a name for the account -> Create.

6. Click on the newly created account, then the add key button.

7. Select create new and generate the file in JSON.

8. Rename the file `credentials.json` and add it to the project directory.

9. Give editing permission to the `client_email` on the folder that you want to control using this script. This `client_email` is the one referred to in the JSON file that was generated.

## Setup for running

- Follow steps 6-9 to give the service account authorization to manage the google drive.

## Running the Script

To add write permissions to a list of email addresses

```bash
node index.js -a gdriveFileName ./pathToTextFileWithEmails.txt
```

To remove write permissions to a list of email addresses:

```
node index.js -r gdriveFileName ./pathToTextFileWithEmails.txt
```

To get an example of the arguments to use:

```
node index.js -h
```
