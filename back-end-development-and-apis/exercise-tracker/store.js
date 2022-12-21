class Store {
    _lastIdGiven = 0;
    _users = new Map(); // (id => username)
    _usernamesTaken = new Set();
    _logs = new Map(); // (id => logs)

    getUsernameById(id) {
        return this._users.get(id);
    }

    createUser(username) {
        let err;
        if (!username) {
            err = { error: "Invalid username", username: username };
        }
        if (this._usernamesTaken.has(username)) {
            err = { error: "Username is already taken" };
        }
        if (err) {
            console.error(err, "@ Store createUser");
            return err;
        }
        username = String(username);
        const _id = String(++this._lastIdGiven); // tests want ids as strings
        this._usernamesTaken.add(username);
        this._users.set(_id, username);
        return { _id, username };
    }

    getAllUsers() {
        const result = [];
        this._users.forEach((username, _id) => result.push({ username, _id }));
        return result;
    }

    createExercises(_id, date, duration, description) {
        _id = String(_id);
        date = date ? new Date(date) : new Date();
        duration = Number(duration);
        description = String(description);
        const exercises = { date, duration, description };
        if (this._logs.get(_id)) {
            this._logs.get(_id).push(exercises);
        } else {
            this._logs.set(_id, [exercises]);
        }
        return {
            _id,
            username: this.getUsernameById(_id),
            date: date.toDateString(),
            duration,
            description,
        };
    }

    getExercisesLogsByUserId(_id, from, to, limit) {
        let optionals = {};
        let log = this._logs.get(_id);
        if (from) {
            from = new Date(from);
            log = log.filter((elem) => from <= elem.date);
            optionals = { ...optionals, from: from.toDateString() };
        }
        if (to) {
            to = new Date(to);
            log = log.filter((elem) => elem.date <= to);
            optionals = { ...optionals, to: to.toDateString() };
        }
        if (limit) {
            log = log.slice(0, limit);
        }
        const log_safeCopy = [];
        log.forEach(({ date, duration, description }) => {
            log_safeCopy.push({
                date: date.toDateString(),
                duration,
                description,
            });
        });
        return {
            _id,
            username: this.getUsernameById(_id),
            ...optionals,
            count: log.length,
            log: log_safeCopy,
        };
    }
}

module.exports = Store;