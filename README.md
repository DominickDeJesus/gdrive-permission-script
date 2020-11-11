# Google Drive Permission Script

## Setup

- Go to https://console.developers.google.com/

- Create/select a project.

- Go to https://console.developers.google.com/apis/credentials and create a service account for the project.

- Click Create Credentials -> Service Account -> Type a name for the account -> Create

- Click on the newly created account, then the add key button.

- Select create new and generate the file in JSON.

- Rename the file `credentials.json` and add it to the project directory.

- Give editing permision to the `client_email` on the folder that you want to control using this script. This `client_email` is the one refered to in the JSON file that was generated.

## Running the Script

```bash
node .
```
