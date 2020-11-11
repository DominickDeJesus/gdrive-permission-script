const { google } = require("googleapis");
const fs = require("fs");
const async = require("async");
const credentials = require("./credentials.json");

const scopes = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key,
	scopes
);

const drive = google.drive({ version: "v3", auth });
let res;
(async function () {
	res = await drive.files.list({
		q: "name='c55'",
		fields: "files(name,id)",
		orderBy: "createdTime desc",
	});
	console.log(res.data);

	let fileId = res.data.files[0].id;
	let students = [
		{
			type: "user",
			role: "writer",
			emailAddress: "nick@wyncode.co",
		},
	];
	aaddPermissions(fileId, students);
	const permList = await drive.permissions.list({
		fields: "permissions(emailAddress,id)",
		fileId: fileId,
	});
	console.log(permList.data.permissions);
})();

function getPermissionIds() {}

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
					console.error(err);
				} else {
					console.log("Permission ID: ", res.data.id);
				}
			}
		);
	});
}

async function addPermissions(fileId, students) {
	students.forEach(async (student) => {
		await drive.permissions.create(
			{
				resource: student,
				fileId: fileId,
				fields: "id",
			},
			function (err, res) {
				if (err) {
					// Handle error...
					console.error(err);
				} else {
					console.log("Account added Permission ID: ", res.data.id);
				}
			}
		);
	});
}

// function addPermissions(fileId, permissions) {
// 	async.eachSeries(
// 		permissions,
// 		function (permission, permissionCallback) {
// 			drive.permissions.create(
// 				{
// 					resource: permission,
// 					fileId: fileId,
// 					fields: "id",
// 				},
// 				function (err, res) {
// 					if (err) {
// 						// Handle error...
// 						console.error(err);
// 						permissionCallback(err);
// 					} else {
// 						console.log("Permission ID: ", res.data.id);
// 						permissionCallback();
// 					}
// 				}
// 			);
// 		},
// 		function (err) {
// 			if (err) {
// 				// Handle error
// 				console.error(err);
// 			} else {
// 				// All permissions inserted
// 				console.log("success");
// 			}
// 		}
// 	);
// }
