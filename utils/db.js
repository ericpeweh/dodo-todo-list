// Dependencies
import * as SQLite from "expo-sqlite";
import moment from "moment";

const db = SQLite.openDatabase("dodo_todo_list");

/* TASK ACTIONS */

export const createTable = tableName => {
	const promise = new Promise((resolve, reject) => {
		const QUERY = `CREATE TABLE IF NOT EXISTS ${tableName} (id STRING PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, timers TEXT NOT NULL, isFinished TEXT NOT NULL, createdAt DATE NOT NULL, lastModified DATE NOT NULL);`;

		db.transaction(tx => {
			tx.executeSql(
				QUERY,
				[],
				_ => {
					resolve();
				},
				(_, err) => {
					reject(err);
				}
			);
		});
	});

	return promise;
};

export const insertTask = async ({ newTask, tableName }) => {
	const { id, title, description, timers, isFinished } = newTask;
	const createdAt = moment.utc().toISOString();
	const lastModified = moment.utc().toISOString();
	const timersString = JSON.stringify(timers);
	const QUERY = `INSERT INTO ${tableName} (id, title, description, timers, isFinished, createdAt, lastModified) VALUES (?, ?, ?, ?, ?, ?, ?);`;

	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				QUERY,
				[id, title, description, timersString, isFinished, createdAt, lastModified],
				(_, result) => {
					resolve({
						...newTask,
						createdAt: createdAt,
						lastModified: lastModified
					});
				},
				(_, err) => {
					console.log(err);
					reject(err);
				}
			);
		});
	});

	return promise;
};

export const editTask = ({ editedTask, tableName }) => {
	const { id, title, description, timers } = editedTask;
	const lastModified = moment.utc().toISOString();
	const timersString = JSON.stringify(timers);
	const QUERY = `UPDATE ${tableName} SET title=?, description=?, timers=?, lastModified=? WHERE id='${id}';`;

	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				QUERY,
				[title, description, timersString, lastModified],
				(_, result) => {
					resolve({
						...editedTask,
						lastModified: lastModified
					});
				},
				(_, err) => {
					console.log(err);
					reject(err);
				}
			);
		});
	});

	return promise;
};

export const fetchTasks = tableName => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT * FROM ${tableName}`,
				[],
				(_, result) => {
					resolve(result);
				},
				_ => {
					reject("TABLE DON'T EXISTS");
				}
			);
		});
	});

	return promise;
};

export const fetchTask = ({ taskId, tableName }) => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT * FROM ${tableName} WHERE id='${taskId}'`,
				[],
				(_, result) => {
					resolve(result);
				},
				_ => {
					reject("FAILED TO FETCH TASK");
				}
			);
		});
	});

	return promise;
};

export const deleteTask = ({ taskId, tableName }) => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`DELETE FROM ${tableName} WHERE id='${taskId}';`,
				[],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject("FAILED TO DELETE TASK");
				}
			);
		});
	});

	return promise;
};

export const markAsFinished = ({ tableName, taskId }) => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`UPDATE ${tableName} SET isFinished=?, timers=? WHERE id='${taskId}'`,
				["1", "[]"],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject(error);
				}
			);
		});
	});

	return promise;
};

export const markAsOngoing = ({ tableName, taskId }) => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`UPDATE ${tableName} SET isFinished=? WHERE id='${taskId}'`,
				["0"],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject(error);
				}
			);
		});
	});

	return promise;
};

export const getAllTable = () => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				"SELECT * from sqlite_master WHERE type='table'",
				[],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject(error);
				}
			);
		});
	});

	return promise;
};

export const cancelAllTimers = ({ tableName, taskId }) => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`UPDATE ${tableName} SET timers=? WHERE id='${taskId}'`,
				["[]"],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject(error);
				}
			);
		});
	});

	return promise;
};

/* TIMER ACTIONS */
export const createTimersTable = () => {
	const promise = new Promise((resolve, reject) => {
		const QUERY = `CREATE TABLE IF NOT EXISTS active_timers (id STRING PRIMARY KEY NOT NULL, taskId STRING TEXT NOT NULL, year INTEGER NOT NULL, month INTEGER NOT NULL, day INTEGER NOT NULL, hour INTEGER NOT NULL, minute INTEGER NOT NULL, tableName STRING NOT NULL, title STRING NOT NULL);`;

		// const QUERY = "DROP TABLE active_timers";

		db.transaction(tx => {
			tx.executeSql(
				QUERY,
				[],
				_ => {
					resolve();
				},
				(_, err) => {
					reject(err);
				}
			);
		});
	});

	return promise;
};

export const fetchTimers = () => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT * FROM active_timers`,
				[],
				(_, result) => {
					resolve(result);
				},
				_ => {
					reject("FAILED TO FETCH TIMERS");
				}
			);
		});
	});

	return promise;
};

export const insertTimer = newTimer => {
	const { id, taskId, year, month, day, hour, minute, tableName, title } = newTimer;
	const QUERY = `INSERT INTO active_timers (id, taskId, year, month, day, hour, minute, tableName, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				QUERY,
				[id, taskId, year, month, day, hour, minute, tableName, title],
				(_, result) => {
					resolve(newTimer);
				},
				(_, err) => {
					console.log(err);
					reject(err);
				}
			);
		});
	});

	return promise;
};

export const deleteTimer = id => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`DELETE FROM active_timers WHERE id='${id}';`,
				[],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject("FAILED TO DELETE TIMER");
				}
			);
		});
	});

	return promise;
};

export const deleteTaskTimers = taskId => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`DELETE FROM active_timers WHERE taskId='${taskId}';`,
				[],
				(_, result) => {
					resolve(taskId);
				},
				(_, error) => {
					reject("FAILED TO DELETE TASK TIMERS");
				}
			);
		});
	});

	return promise;
};

/* STATISTICS */
export const countTasksAmountDB = tableName => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT COUNT(*) FROM ${tableName};`,
				[],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject(error);
				}
			);
		});
	});

	return promise;
};

export const countTasksFinishedDB = tableName => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT COUNT(*) FROM ${tableName} WHERE isFinished='1';`,
				[],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject(error);
				}
			);
		});
	});

	return promise;
};

export const countTasksOngoingDB = tableName => {
	const promise = new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT COUNT(*) FROM ${tableName} WHERE isFinished='0';`,
				[],
				(_, result) => {
					resolve(result);
				},
				(_, error) => {
					reject(error);
				}
			);
		});
	});

	return promise;
};
