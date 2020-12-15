const { google } = require("googleapis");
const fs = require("fs").promises;
//the credentials that you download for the service account on google console
const credentials = require("./credentials.json");

const scopes = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key,
	scopes
);
const drive = google.drive({ version: "v3", auth });

//entry point
(async () => {
	try {
		const args = process.argv.slice(2);

		await checkCliArgs(args);
		const emails = await getAccountEmails(args[2]);
		const file = await getFileId(args[1]);

		if (args[0] === "-r" || args[0] === "--remove") {
			const permIds = await getPermissionIds(file, emails);
			await removePermissions(file, permIds);
		} else if (args[0] === "-a" || args[0] === "--add") {
			await addPermissions(file, emails);
		} else {
			throw new Error({ error: "Wrong cli arguments!" });
		}
	} catch (error) {
		console.log(error.message);
	}
})();

/**
 * Reads a text file of emails and returns an array.
 * @param {array} emailsFile
 * @returns {array} the emails
 */
async function getAccountEmails(emailsFile) {
	try {
		const data = await fs.readFile(emailsFile);
		array = data
			.toString()
			.replace(/\r\n/g, "\n")
			.split("\n")
			.trim()
			.filter((item) => item);
		console.log("Emails array: ", array);
		return array;
	} catch (error) {
		console.log(error.message);
	}
}

/**
 * Gets the fileId that the service account can access.
 * @param {string} fileName
 * @returns {string} Id of the file as string
 */
async function getFileId(fileName) {
	const res = await drive.files.list({
		q: `name='${fileName}'`,
		fields: "files(name,id)",
		orderBy: "createdTime desc",
	});
	console.log("Found this file: ", res.data.files);

	return res.data.files[0].id;
}

/**
 * Gets a list of ids and emails of everyone that has permissions for a file.
 * @param {string} fileId
 * @param {array} emails an array of emails to get permissions for.
 * @returns {array} an array of objects with emailAddress and id properties
 */
async function getPermissionIds(fileId, emails) {
	const {
		data: { permissions },
	} = await drive.permissions.list({
		fields: "permissions(emailAddress,id)",
		fileId: fileId,
	});
	const filteredPermissions = permissions
		.filter((permObj) => {
			return emails.includes(permObj.emailAddress);
		})
		.map((permObj) => {
			return permObj.id;
		});
	console.log("Permissions id array ", filteredPermissions);
	return filteredPermissions;
}

/**
 * Removes the given permesssions of for the specified file.
 * @param {string} fileId
 * @param {array} permissionIds an array of ids
 */
function removePermissions(fileId, permissionIds) {
	permissionIds.forEach((permissionId) => {
		drive.permissions.delete(
			{
				fileId: fileId,
				permissionId: permissionId,
			},
			function (err, res) {
				if (err) {
					// Handle error...
					console.error(err.message);
				} else {
					console.log("Account removed Permission ID");
				}
			}
		);
	});
}

/**
 * Adds permission to a file.
 * @param {string} fileId
 * @param {array} accounts an array of emails.
 */
async function addPermissions(fileId, accounts) {
	accounts.forEach(async (account) => {
		await drive.permissions.create(
			{
				resource: {
					type: "user",
					role: "writer",
					emailAddress: account,
				},
				fileId: fileId,
				fields: "id",
			},
			function (err, res) {
				if (err) {
					// Handle error...
					console.error(err.message);
				} else {
					console.log("Account added Permission ID: ", res.data.id);
				}
			}
		);
	});
}

async function checkCliArgs(argArr) {
	switch (argArr[0]) {
		case "-r":
		case "-a":
		case "-add":
		case "-remove":
			break;
		case "-h":
		case "--help":
			throw new Error(
				"Sample input: node index.js gdrivefilename ./FilePathToEmailsList.txt"
			);
		default:
			throw new Error(
				"Bad argument: epxecting -r or -a! For sample input use: node index.js -h"
			);
	}

	if (!argArr[1])
		throw new Error("Bad argument: expecting a google drive file name");

	const stat = await fs.lstat(argArr[2]);
}
